define(['../jquery-3.1.1', './base'], function ($zace, $com) {

    var route = (function () {
        var target = {};
        var dragFn;
        var cv = $(document).scrollTop();
        var cl = $(document).scrollLeft();
        var tepCanvas;
        var moseLoction;
        //var moseLoctionY;
        var route_show = function ($contain, parms) {
            cv = $(document).scrollTop(0);
            cl = $(document).scrollLeft(0);
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
                fn_drag: function (data) { },//拖拽事件

                constant: {

                    borderSpace: 30,//距离边框多少滚动条移动
                    minTime: 500,//定时器所定的时间
                    scrollMove: 500,//滚动条开始移动距离
                    scrollSpace:200,//滚动条叠加值
                    dottedLine: false,//支线是否虚线  默认有
                    lineOperation: false,//是否操作线条
                    margin_top: 100,
                    margin_left: 150,
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
                    dragColor: "gold",
                }
            };
            var $Canvas = $('<canvas id="Canvas1"></canvas>');
            var mouseoverFn = undefined,
                mouseoutFn = undefined,
                clickFn = undefined;
            dragFn = undefined;
            if (!$contain)
                return;
            if (!($contain instanceof jQuery)) {
                alert("这不是一个jQuery对象,请更改容器！");
                return;
            }
            var options_p = parms;
            options_p.constant = {
                borderSpace: parms.constant.borderSpace ? parms.constant.borderSpace : _parms.constant.borderSpace,
                minTime: parms.constant.minTime ? parms.constant.minTime : _parms.constant.minTime,
                scrollMove: parms.constant.scrollMove ? parms.constant.scrollMove : _parms.constant.scrollMove,
                scrollSpace: parms.constant.scrollSpace ? parms.constant.scrollSpace : _parms.constant.scrollSpace,
                dottedLine: parms.constant.dottedLine ? parms.constant.dottedLine : _parms.constant.dottedLine,
                lineOperation: parms.constant.lineOperation ? parms.constant.lineOperation : _parms.constant.lineOperation,
                dragColor: parms.constant.dragColor ? parms.constant.dragColor : _parms.constant.dragColor,
                margin_top: parms.constant.margin_top ? parms.constant.margin_top : _parms.constant.margin_top,
                margin_left: parms.constant.margin_left ? parms.constant.margin_left : _parms.constant.margin_left,
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
            }

            mouseoverFn = options_p.fn_mouseover;
            mouseoutFn = options_p.fn_mouseout;
            clickFn = options_p.fn_click;
            dragFn = options_p.fn_drag;
            //lineFn = options_p.fn_line;
            var _data = {};  //保存最大宽度和最大高度
            var coordinate = {};//缓存上一个坐标
            var obj = getXY(options_p.data, options_p.constant);
            var offset = options_p.constant.offset;
            //将第一行数据进行排列
            var data = obj.rect;
            options_p.data = data;
            var bottonList = [];//按钮坐标集合
            // var isLineChange = false;//启动支线设置
            //var isDrag = false;//启动拖拽布局
            var _Clonedata = $com.util.Clone(data);
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
                width: maxX + options_p.constant.rect_width * 2,
                height: maxY + (options_p.constant.levelSpace + options_p.constant.rect_height / 2) * 2,
            };
            $Canvas[0].width = _data.width;
            $Canvas[0].height = _data.height;
           
            var canvas1 = $Canvas[0];
            
            $contain.append($Canvas);
            var canvasLeft = $Canvas[0].getBoundingClientRect().left;
            var canvasTop = $Canvas[0].getBoundingClientRect().top;
            var ctx = canvas1.getContext("2d");
            //判断是开启支线更改
            if (options_p.constant.lineOperation) {
                var $Canvas_drag = $('<canvas id="canvas2" width=' + canvas1.width + ' height=' + canvas1.height + ' style=" opacity:0.8;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                $contain.append($Canvas_drag);
                var canvas2 = $Canvas_drag[0];
                var ctx2 = canvas2.getContext("2d");
            }
            //找出主线和调线分割点
            var overPoint = 0;
            for (var i = 0; i < obj.line.length; i++) {
                if (obj.line[i] == "overMainLine") {
                    overPoint = i;
                }
            }
            for (var i = 0; i < obj.line.length; i++) {
                if (i < overPoint) {
                    for (var j = 0; j < obj.line[i].length; j++) {
                        if (j > 0) {
                            drawLineForPoint(ctx,
                              obj.line[i][j - 1].X,
                              obj.line[i][j - 1].Y,
                              obj.line[i][j].X,
                              obj.line[i][j].Y,
                              options_p.foreground_color,
                              options_p.constant);
                            //if (j == obj.line[i].length-1){
                            if (obj.line[i].length > 2) {
                                if (j == obj.line[i].length-1)
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
                } else if (i == overPoint) {
                    continue;
                } else if (i > overPoint) {
                    for (var j = 0; j < obj.line[i].length; j++) {
                        if (j > 0) {
                            if (options_p.constant.dottedLine) {
                                drawDottedLine(ctx, obj.line[i][j - 1].X, obj.line[i][j - 1].Y,
                                    obj.line[i][j].X, obj.line[i][j].Y,
                                    options_p.foreground_color, 2, 5);
                                if (obj.line[i].length > 2) {
                                     if (j==obj.line[i].length-1)
                                    drawArrowForPoint(ctx, obj.line[i][j - 1].X, obj.line[i][j - 1].Y, obj.line[i][j].X, obj.line[i][j].Y, options_p.foreground_color, options_p.constant);
                                } else {
                                    if (obj.line[i][1].X == obj.line[i][0].X) {
                                        drawArrow(ctx, obj.line[i][1].X, obj.line[i][1].Y, "bottom", options_p.foreground_color, options_p.constant);
                                    } else {
                                        drawArrow(ctx, obj.line[i][j].X, obj.line[i][j].Y, "right", options_p.foreground_color, options_p.constant);
                                    }
                                }
                            } else {
                                if (j > 0) {
                                    drawLineForPoint(ctx,
                                      obj.line[i][j - 1].X,
                                      obj.line[i][j - 1].Y,
                                      obj.line[i][j].X,
                                      obj.line[i][j].Y,
                                      options_p.foreground_color,
                                      options_p.constant);
                                    if (obj.line[i].length > 2) {
                                        if (j == obj.line[i].length - 1)
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
            //定时判断是否移动滚动条
            if (dragFn && !options_p.constant.lineOperation) {
                //setInterval(function () {
                //    if (moseLoction - cl > $(document.body).width() - options_p.constant.borderSpace) {
                //        $(document).scrollLeft(options_p.constant.scrollMove);
                //        options_p.constant.scrollMove += options_p.constant.scrollSpace;
                //    }
                //    if (moseLoction - cl <= options_p.constant.borderSpace) {
                //        $(document).scrollLeft(options_p.constant.scrollMove);
                //        options_p.constant.scrollMove -= options_p.constant.scrollSpace;
                //    }
                //    cv = $(document).scrollTop();
                //    cl = $(document).scrollLeft();
                //}, options_p.constant.minTime);
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
            if (!options_p.constant.lineOperation && !dragFn) {
                canvas1.addEventListener("click", function (event) {
                    getMousePos_click(canvas1, event, obj.rect, options_p, clickFn);
                });
            }
            if (options_p.constant.lineOperation) {
                canvas2.addEventListener("click", function (event) {
                    $(".route-main").remove();
                    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                    changeLine_click(canvas2, event, obj, options_p, canvasLeft, canvasTop, $contain);
                });
            }
            //cavans鼠标按压事件
            if (dragFn && !options_p.constant.lineOperation)
                canvas1.onmousedown = function (ev) {
                    var e = ev || event;
                    var x = e.clientX;
                    var y = e.clientY;
                    cv = $(document).scrollTop();
                    cl = $(document).scrollLeft();
                    drag(x - canvasLeft + cl, y - canvasTop + cv);
                }
            //拖拽函数
            var drag = function (x, y) {
                setInterval(function () {
                    if (moseLoction - cl > $(document.body).width() - options_p.constant.borderSpace) {
                        $(document).scrollLeft(options_p.constant.scrollMove);
                        options_p.constant.scrollMove += options_p.constant.scrollSpace;
                    }
                    if (moseLoction - cl <= options_p.constant.borderSpace) {
                        $(document).scrollLeft(options_p.constant.scrollMove);
                        options_p.constant.scrollMove -= options_p.constant.scrollSpace;
                    }
                    cv = $(document).scrollTop();
                    cl = $(document).scrollLeft();
                }, options_p.constant.minTime);
                //判断鼠标按压的地方是否在流程格子里面
                var data = $com.util.Clone(_Clonedata);
                var drag_obj = isRouteRect(x, y, data, options_p.constant);
                // var _data=[]//需要重绘的数据
                if (drag_obj.bool == true) {
                    //新增canvas透明画布，平且覆盖以前的画布
                    var $Canvas_drag = $('<canvas id="canvas3" width=' + canvas1.width + ' height=' + canvas1.height + ' style=" opacity:0.9;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                    $contain.append($Canvas_drag);
                    var canvas3 = $Canvas_drag[0];
                    var ctx3 = canvas3.getContext("2d");

                    var $Canvas_drag = $('<canvas id="canvas2" width=' + canvas1.width + ' height=' + canvas1.height + ' style=" opacity:0.4;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                    $contain.append($Canvas_drag);
                    var canvas2 = $Canvas_drag[0];
                    var ctx2 = canvas2.getContext("2d");

                    var _bool = false;
                    var _allowMove = [];//鼠标允许范围集合
                    var _dataInfo = {};//自身流程
                    var _borderData = {};

                    //将范围装入集合
                    for (var i = 0; i < data.length; i++) {
                        _allowMove.push({ info: data[i], X: data[i].X + options_p.constant.rect_width / 2, Y: data[i].Y - options_p.constant.rect_height / 2 });
                    }
                    //鼠标移动事件
                    canvas2.onmousemove = function (ev) {
                            var e = ev || event;
                            var ax = e.clientX;
                            var ay = e.clientY;
                 
                      
                        cv = $(document).scrollTop();
                        cl = $(document).scrollLeft();
                        var x = ax - canvasLeft + cl;
                        var y = ay - canvasTop+cv;
                        moseLoction = x;
                       // moseLoctioY = y;
                       
                        var data = $com.util.Clone(_Clonedata);
                      
                        //改变鼠标样式
                        $(this).css("cursor", "not-allowed");
                        //自身范围的时候
                        if (!_bool) {
                            for (var i = 0; i < data.length; i++) {
                                if (x >= data[i].X - options_p.constant.rect_width / 2 && x <= data[i].X + options_p.constant.rect_width / 2) {
                                    if (y >= data[i].Y - options_p.constant.rect_height / 2 && y <= data[i].Y + options_p.constant.rect_height / 2) {
                                        _bool = true;
                                        _dataInfo = data[i];
                                    }
                                }
                            }
                        }
                        //自身加金色边框区分
                        if (_dataInfo.Type == 1) {
                            drawBorder(ctx, _dataInfo.X - options_p.constant.rect_width / 2, _dataInfo.Y - options_p.constant.rect_height / 2, options_p.constant.dragColor, options_p.constant, _dataInfo.Type);
                        }
                        if (_dataInfo.Type == 2 || _dataInfo.Type == 3) {
                            drawBorder(ctx, _dataInfo.X, _dataInfo.Y, options_p.constant.dragColor, options_p.constant, _dataInfo.Type);
                        }
                        if (x >= _dataInfo.X - options_p.constant.rect_width / 2 && x <= _dataInfo.X + options_p.constant.rect_width / 2) {
                            if (y >= _dataInfo.Y - options_p.constant.rect_height / 2 && y <= _dataInfo.Y + options_p.constant.rect_height / 2) {
                                $(this).css("cursor", "pointer");
                            }
                        }
                        //除自身以外的
                        //删除自身
                        for (var i = 0; i < _allowMove.length; i++) {
                            if (_allowMove[i].X - options_p.constant.rect_width / 2 == _dataInfo.X && _allowMove[i].Y + options_p.constant.rect_height / 2 == _dataInfo.Y)
                                _allowMove.splice(i, 1);
                        }
                        for (var i = 0; i < _allowMove.length; i++) {
                            if (x > _allowMove[i].X && x < _allowMove[i].X + options_p.constant.levelSpace && y > _allowMove[i].Y && y < _allowMove[i].Y + options_p.constant.rect_height) {
                                $(this).css("cursor", "pointer");
                                var _dataAgin = addSpareData(x, y, data, _dataInfo, options_p.constant);
                                //画布一的透明度设置为0
                                $("#Canvas1").css("opacity", "0");
                                //画布三重新绘制
                                _borderData = clearCloth(ctx3, _dataAgin, options_p, _dataInfo);
                                break;
                            }
                            if (x > _allowMove[i].X - options_p.constant.rect_width - options_p.constant.levelSpace && x < _allowMove[i].X - options_p.constant.rect_width) {
                                if (y > _allowMove[i].Y && y < _allowMove[i].Y + options_p.constant.rect_height) {
                                    $(this).css("cursor", "pointer");
                                    var _dataAgin = addSpareData(x, y, data, _dataInfo, options_p.constant);
                                    $("#Canvas1").css("opacity", "0");
                                    //画布三重新绘制
                                    _borderData = clearCloth(ctx3, _dataAgin, options_p, _dataInfo);
                                    break;
                                }
                            }
                        }
                        //添加分支停放
                        for (var i = 0; i < data.length; i++) {
                            var _son = manySon(data, data[i].ID);
                            if (x > _son.X - options_p.constant.rect_width / 2 && x < _son.X + options_p.constant.rect_width / 2) {
                                if (y > _son.Y + options_p.constant.rect_height / 2 && y < _son.Y + options_p.constant.rect_height / 2 * 3) {
                                    $(this).css("cursor", "pointer");
                                    var _dataAgin = addSpareData(x, y, data, _dataInfo, options_p.constant);
                                    $("#Canvas1").css("opacity", "0");
                                    //画布三重新绘制
                                    _borderData = clearCloth(ctx3, _dataAgin, options_p, _dataInfo);
                                    break;
                                }
                            }
                        }

                        if ($("#canvas2")[0].style.cursor == "not-allowed") {
                            $("#Canvas1").css("opacity", "1");
                            ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
                        }
                        //鼠标移动每一帧都清除该格子
                        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                        //重新画格子
                        againDrawRect(ax - canvasLeft+cl, ay - canvasTop+cv, drag_obj.dataInfo, ctx2, options_p,e);

                    };
                    //鼠标移开事件
                    canvas2.onmouseup = function (ev) {

                        canvas2.onmousemove = null;
                        //canvas2.onmouseup = null;
                        var e = ev || event;
                        var ax = e.clientX;
                        var ay = e.clientY;
                       
                        var data = $com.util.Clone(_Clonedata);
                        if ($("#canvas2")[0].style.cursor == "not-allowed") {
                            $contain.empty();
                            route_show($contain, options_p);
                            return;
                        }
                        //第一步：判断位置，以及改变数据
                        var _data = ReleaseEvnt(ax - canvasLeft+cl, ay - canvasTop+cv, data, drag_obj.dataInfo, options_p.constant);

                        options_p.data = _data;
                        $contain.empty();
                        dragFn({ data: options_p });
                        route_show($contain, options_p);
                    };
                }

            }
        }

        var getFrame = function (targetData, canvasLeft, canvasTop, options_p, canvas2, $contain, lineList) {
            tepCanvas = canvas2;
            var frameHeight = 25 + 20 * targetData.NextIDList.length + 10;
            var topspace = targetData.Y + options_p.constant.rect_height / 2;
            var leftspace = targetData.X - options_p.constant.rect_width / 2; //WhiteSmoke
            var Main = ['<div class="route-main" style="height:' + frameHeight + 'px;width:150px;background-color:black ;',
            'opacity:0.8;border-radius:6px;position:absolute;top:' + topspace + 'px;left:' + leftspace + 'px">',
            '<div class="route-top" style="height:25px;width:100%">',
            '<div class="route-top-left" style="width:70%;float:left;align-content:center;margin-left:10px;margin-top:3px">',
                '<span style="font-weight:bold;font-size:15px;color:white">' + targetData.KKK + '</span>',
            '</div>',
            '<div class="route-top-right route-top-add" style="width:15%;float:right;margin-top:3px">',
                '<div class="glyphicon glyphicon-plus" style="height:100%;width:100%;color:white"></div>',
            '</div>',
        '</div>',
            '<div class="route-center-line" style="width:100%;height:1px;background-color:gray"></div>',
        '<div class="route-bottom" style="height:auto;width:100%;background-color:black ;opacity:0.8">',
        '</div>',
     '</div>'].join("");
            var sonList = ['<div class="route-bottom-template" data-id="{{ID}}">',
            '<div class="route-bottom-left" data-name="{{KKK}}" style="width:68%;float:left;align-content:center;margin-left:10px;margin-top:3px">',
                '<span style="color:white">{{KKK}}</span>',
            '</div>',
            '<div class="route-bottom-right route-bottom-remove" data-name="{{KKK}}" style="width:12%;float:right;margin-top:3px">',
                '<div class="glyphicon glyphicon-remove" style="height:100%;width:100%;color:white"></div>',
            '</div>',
            '<div class="route-bottom-right route-bottom-deit" style="width:12%;float:right;margin-top:3px">',
                '<div class="glyphicon glyphicon-pencil" style="height:100%;width:100%;color:white"></div>',
            '</div>',
        '</div>'].join("");
            var _list = [];
            for (var i = 0; i < options_p.data.length; i++) {
                for (var j = 0; j < targetData.NextIDList.length; j++) {
                    if (options_p.data[i].ID == targetData.NextIDList[j]) {
                        _list.push(options_p.data[i]);
                    }
                }
            }
            $("body").append(Main);
            $(".route-bottom").html($com.util.template(_list, sonList));
            
            //点击出现线条边框parseInt(_sonID))
            $(".route-bottom-left").click(function () {
                var _ctx = canvas2.getContext("2d");
                _ctx.clearRect(0, 0, canvas2.width, canvas2.height);
                //第一步：求出子集详细数据
                var _sonID = $(this).parent().attr("data-id");
                var _sonData = {};
                var _thisLine = [];
                for (var i = 0; i < options_p.data.length; i++) {
                    if (options_p.data[i].ID == parseInt(_sonID)) {
                        _sonData = options_p.data[i];
                    }
                }
                //第二步：判断子集在父级的位置,并找出线条
                var _retrunData = getPosition(options_p.data, targetData.X, targetData.Y, _sonData.ID);
                if (_retrunData.direction == "top" || _retrunData.direction == "top_left" || _retrunData.direction == "top_right") {
                    for (var i = 0; i < lineList.length; i++) {
                        if (lineList[i][0].X == targetData.X + options_p.constant.rect_width / 2  && lineList[i][0].Y == targetData.Y) {
                            if (lineList[i][lineList[i].length - 1].X == _sonData.X - options_p.constant.rect_width / 2  && lineList[i][lineList[i].length - 1].Y == _sonData.Y) {
                                _thisLine = lineList[i];
                            }
                        }
                    }

                } else if (_retrunData.direction == "left" || _retrunData.direction == "right") {
                    if (isRightLine(targetData, _sonData, options_p.data)) {
                        for (var i = 0; i < lineList.length; i++) {
                            if (lineList[i][0].X == targetData.X + options_p.constant.rect_width / 2 && lineList[i][0].Y == targetData.Y) {
                                if (lineList[i][lineList[i].length - 1].X == _sonData.X - options_p.constant.rect_width / 2 && lineList[i][lineList[i].length - 1].Y == _sonData.Y) {
                                    _thisLine = lineList[i];
                                }
                            }
                        }
                    }else{
                        for (var i = 0; i < lineList.length; i++) {
                            if (lineList[i][0].X == targetData.X + options_p.constant.rect_width / 2 && lineList[i][0].Y == targetData.Y) {
                                if (lineList[i][lineList[i].length - 1].X == _sonData.X && lineList[i][lineList[i].length - 1].Y == _sonData.Y - options_p.constant.rect_height / 2) {
                                    _thisLine = lineList[i];
                                }
                            }
                        }
                    }

                } else if (_retrunData.direction == "left_bottom" || _retrunData.direction == "right_bottom") {
                    for (var i = 0; i < lineList.length; i++) {
                        if (lineList[i][0].X == targetData.X && lineList[i][0].Y == targetData.Y + options_p.constant.rect_height / 2) {
                            if (lineList[i][lineList[i].length - 1].X == _sonData.X && lineList[i][lineList[i].length - 1].Y == _sonData.Y - options_p.constant.rect_height / 2) {
                                _thisLine = lineList[i];
                            }
                        }
                    }
                } else if (_retrunData.direction == "bottom") {
                    if (isBottomLine(targetData, _sonData, options_p.data)) {
                        for (var i = 0; i < lineList.length; i++) {
                            if (lineList[i][0].X == targetData.X && lineList[i][0].Y == targetData.Y + options_p.constant.rect_height / 2) {
                                if (lineList[i][lineList[i].length - 1].X == _sonData.X && lineList[i][lineList[i].length - 1].Y == _sonData.Y - options_p.constant.rect_height / 2) {
                                    _thisLine = lineList[i];
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < lineList.length; i++) {
                            if (lineList[i][0].X == targetData.X+options_p.constant.rect_width/2 && lineList[i][0].Y == targetData.Y ) {
                                if (lineList[i][lineList[i].length - 1].X == _sonData.X && lineList[i][lineList[i].length - 1].Y == _sonData.Y - options_p.constant.rect_height / 2) {
                                    _thisLine = lineList[i];
                                }
                            }
                        }
                    }
                }
                //画出金黄色支线
                //var canvasLeft = canvas1.getBoundingClientRect().left;
                //var canvasTop = canvas1.getBoundingClientRect().top;
                //var $Canvas_drag = $('<canvas id="canvas2" width=' + canvas1.width + ' height=' + canvas1.height + ' style=" opacity:0.8;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                //$contain.append($Canvas_drag);
                //var canvas2 = $Canvas_drag[0];
                //var ctx2 = canvas2.getContext("2d");

                for (var j = 0; j < _thisLine.length; j++) {
                    if (j > 0) {
                        drawLineForPoint(_ctx,
                          _thisLine[j - 1].X,
                          _thisLine[j - 1].Y,
                          _thisLine[j].X,
                          _thisLine[j].Y,
                          options_p.constant.dragColor,
                          options_p.constant);
                        if (_thisLine.length > 2) {
                            if (j==_thisLine.length-1)
                            drawArrowForPoint(_ctx, _thisLine[j - 1].X, _thisLine[j - 1].Y, _thisLine[j].X, _thisLine[j].Y, options_p.constant.dragColor, options_p.constant);
                        } else {
                            if (_thisLine[1].X == _thisLine[0].X) {
                                drawArrow(_ctx, _thisLine[1].X, _thisLine[1].Y, "bottom", options_p.constant.dragColor, options_p.constant);
                            } else {
                                drawArrow(_ctx, _thisLine[j].X, _thisLine[j].Y, "right", options_p.constant.dragColor, options_p.constant);
                            }
                        }
                    }
                }
            });
            //添加新增事件
            $(".route-top-add").click(function () {
                alert("请点双击被添加的流程(金黄色边框)", function () {
                    var $Canvas_drag = $('<canvas id="_canvas2"  width=' + canvas2.width + ' height=' + canvas2.height + ' style=" opacity:1;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                    $contain.append($Canvas_drag);
                    var _canvas2 = $Canvas_drag[0];
                    var ctx2 = _canvas2.getContext("2d");
                    //给需要双击的部位加边框
                    addBoder(ctx2, targetData, options_p);
                    _canvas2.addEventListener("dblclick", function (event) {
                        return_click(_canvas2, event, options_p.data, options_p, canvasLeft, canvasTop);
                        if (target.ID == targetData.ID) {
                            alert("支流程不能选择本流程");
                            return false;
                        }
                        if (!target.ID)
                            return;

                        targetData.NextIDList.push(target.ID);
                        //加入已选择的支流程
                        for (var i = 0; i < options_p.data.length; i++) {
                            if (targetData.ID == options_p.data[i].ID) {
                                options_p.data[i] = targetData;
                            }
                        }
                        target = {};
                        $contain.empty();
                        dragFn({ data: options_p });
                        route_show($contain, options_p);
                    });
                });
            });
            //添加修改事件
            $(".route-bottom-deit").click(function () {
                var _sonID = $(this).parent().attr("data-id");
                alert("请点双击将要修改的流程(金黄色边框区域)", function () {
                    var $Canvas_drag = $('<canvas id="_canvas2"  width=' + tepCanvas.width + ' height=' + tepCanvas.height + ' style=" opacity:1;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                    // var $Canvas_drag = $('<canvas id="canvas2" width=' + canvas2.width + ' height=' + canvas2.height + ' style=" opacity:1;position:absolute;top:' + canvasTop + 'px;left:' + canvasLeft + 'px"></canvas>');
                    $contain.append($Canvas_drag);
                    var canvas2 = $Canvas_drag[0];
                    var ctx2 = canvas2.getContext("2d");
                    //给需要双击的部位加边框
                    addBoder(ctx2, targetData, options_p);
                    canvas2.addEventListener("dblclick", function (event) {
                        return_click(canvas2, event, options_p.data, options_p, canvasLeft, canvasTop);
                        if (target.ID == targetData.ID) {
                            alert("支流程不能选择本流程");
                            return false;
                        }
                        if (!target.ID)
                            return;

                        for (var i = 0; i < targetData.NextIDList.length; i++) {
                            if (targetData.NextIDList[i] == parseInt(_sonID)) {
                                targetData.NextIDList[i] = target.ID;
                            }
                        }
                        //targetData.NextIDList.push(target.ID);
                        //加入已选择的支流程
                        for (var i = 0; i < options_p.data.length; i++) {
                            if (targetData.ID == options_p.data[i].ID) {
                                options_p.data[i] = targetData;
                            }
                        }
                        target = {};
                        $contain.empty();
                        dragFn({ data: options_p });
                        route_show($contain, options_p);
                    });
                });
            });
            //添加删除事件
            $(".route-bottom-remove").click(function () {
                var _sonID = $(this).parent().attr("data-id");
                var _sonName = $(this).attr("data-name");
                if (_sonID) {
                    for (var i = 0; i < targetData.NextIDList.length; i++) {
                        if (targetData.NextIDList[i] == parseInt(_sonID)) {
                            targetData.NextIDList.splice(i, 1);
                        }
                    }
                    for (var i = 0; i < options_p.data.length; i++) {
                        if (targetData.ID == options_p.data[i].ID) {
                            options_p.data[i] = targetData;
                        }
                    }
                    $contain.empty();
                    dragFn({ data: options_p });
                    route_show($contain, options_p);
                }

            });
            
        }
        var addBoder = function (ctx2, targetData, options_p) {
            var data = options_p.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == targetData.ID) {
                    continue;
                } else {
                    if (data[i].Type == 1) {
                        drawBorder(ctx2, data[i].X - options_p.constant.rect_width / 2, data[i].Y - options_p.constant.rect_height / 2, options_p.constant.dragColor, options_p.constant, data[i].Type);
                    } else {
                        drawBorder(ctx2, data[i].X, data[i].Y, options_p.constant.dragColor, options_p.constant, data[i].Type);
                    }
                }
            }
        }
        //最下面的子集
        var manySon = function (data, ID) {
            var _son = {};
            for (var i = 0; i < data.length; i++) {
                if (data[i].PrevID == ID) {
                    _son = data[i];
                }
            }
            return _son;
        }
        //进行加入备用数据并处理新数据
        var drawArc = function (ctx3, x, y, data, constant, color) {
            var leftData;//左边第一个
            //第一步：判断松开位置的左边是谁（结合垂直一起判断）
            //删除备用数据

            for (var i = 0; i < data.length; i++) {
                if (data[i].X < x && x - data[i].X < (constant.rect_width + constant.levelSpace)) {
                    if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height))) {
                        leftData = data[i];
                    }
                }
            }
            if (leftData) {
                ctx3.beginPath();
                ctx3.arc(leftData.X + constant.levelSpace / 2 + constant.rect_width / 2,
                        leftData.Y, constant.levelSpace / 2, 0, 2 * Math.PI);
                ctx3.strokeStyle = color;
                ctx3.stroke();
                ctx3.closePath();
            } else {//当左边没有流程的时候
                //判断右边有没有流程
                var _rdata;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].X > x && data[i].X - x < (constant.rect_width + constant.levelSpace)) {
                        if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height))) {
                            _rdata = data[i];
                        }
                    }
                }
                if (_rdata) {
                    ctx3.beginPath();
                    ctx3.arc(_rdata.X - constant.levelSpace / 2 - constant.rect_width / 2,
                            _rdata.Y, constant.levelSpace / 2, 0, 2 * Math.PI);
                    ctx3.strokeStyle = color;
                    ctx3.stroke();
                    ctx3.closePath();
                }
            }
        }
        //进行加入备用数据并处理新数据
        var addSpareData = function (x, y, data, dataInfo, constant) {
            var _dataInfo = $com.util.Clone(dataInfo);
            var _data = data;
            var leftData;//左边第一个
            var rightData = {};//右边第一个
            //第一步：判断松开位置的左边是谁（结合垂直一起判断）
            //删除备用数据
            for (var i = 0; i < _data.length; i++) {
                if (_data[i].ID == 1000) {
                    _data.splice(i, 1);
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].X < x && x - data[i].X < constant.levelSpace + constant.rect_width / 2 && x - data[i].X > constant.rect_width / 2) {
                    if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height))) {
                        leftData = data[i];
                    }
                }
            }
            if (leftData) {
                //第二步：结合位置来处理数据，并返回
                //水平左边一个数据相关的做处理
                //求X轴相等的坐标的子集
                var spareData = _dataInfo;
                spareData.ID = 1000;
                spareData.KKK = _dataInfo.KKK;
                spareData.isSpare = true;
                for (var i = 0; i < data.length; i++) {
                    if (leftData.ID == data[i].PrevID) {
                        rightData = data[i];
                        rightData.PrevID = spareData.ID;
                        rightData.OrderID += 1;
                        replaceArray(_data, [rightData]);
                        var _list = iteration(data, rightData.ID, []);
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].OrderID += 1;
                        }
                        replaceArray(_data, _list);
                        break;
                    }
                }
                spareData.PrevID = leftData.ID;
                spareData.OrderID = leftData.OrderID + 1;
                _data.push(spareData);
            } else {//当左边没有流程的时候
                //判断右边有没有流程
                var _rdata;
                //if (data[i].X > x && data[i].X - x < (constant.rect_width + constant.levelSpace) && data[i].X - x > constant.rect_width / 2) {
                //    if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height))) {
                //        _rdata = data[i];
                //    }
                //}
                for (var i = 0; i < data.length; i++) {
                    if (data[i].X > x && data[i].X - x < (constant.rect_width / 2 + constant.levelSpace) && data[i].X - x > constant.rect_width / 2) {
                        if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height))) {
                            _rdata = data[i];
                        }
                    }
                }
                if (_rdata) {
                    //第二步：结合位置来处理数据，并返回
                    var spareData = _dataInfo;
                    spareData.ID = 1000;
                    spareData.KKK = _dataInfo.KKK;
                    spareData.isSpare = true;
                    spareData.PrevID = _rdata.PrevID;
                    if (_rdata.PrevID || _rdata.OrderID == 1) {
                        _rdata.OrderID += 1;
                        _rdata.PrevID = spareData.ID;
                    }
                    if (!_rdata.PrevID && _rdata.OrderID > 1) {
                        _rdata.PrevID = spareData.ID;
                    }

                    replaceArray(_data, [_rdata]);
                    var _list = iteration(data, _rdata.ID, []);
                    for (var j = 0; j < _list.length; j++) {
                        _list[j].OrderID += 1;
                    }
                    replaceArray(_data, _list);
                    //spareData.PrevID = _rdata.PrevID;
                    spareData.OrderID = _rdata.OrderID - 1;
                    //replaceArray(_data, [dataInfo]);
                    _data.push(spareData);
                } else {
                    var _sonList = [];
                    var _farList = [];
                    var _tdata;
                    //if ((x >= data[i].X && x - data[i].X <= constant.rect_width / 2 + constant.levelSpace) || (x <= data[i].X && data[i].X - x <= constant.rect_width / 2 + constant.levelSpace)) {
                    //    if (y >= data[i].Y && y - data[i].Y - constant.rect_height / 2 <= constant.rect_height) {
                    //        _tdata = data[i];
                    //    }
                    //}
                    for (var i = 0; i < data.length; i++) {
                        if ((x >= data[i].X && x - data[i].X <= constant.rect_width / 2) || (x <= data[i].X && data[i].X - x <= constant.rect_width / 2)) {
                            if (y >= data[i].Y && y - data[i].Y - constant.rect_height / 2 <= constant.rect_height) {
                                _tdata = data[i];
                            }
                        }
                    }
                    var spareData = _dataInfo;
                    spareData.ID = 1000;
                    spareData.KKK = _dataInfo.KKK;
                    spareData.isSpare = true;
                    spareData.PrevID = _tdata.PrevID;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].PrevID == _dataInfo.ID) {
                            _sonList.push(data[i]);
                        }
                        if (data[i].ID == _dataInfo.PrevID) {
                            _farList = data[i];
                        }
                    }
                    for (var i = 0; i < _sonList.length; i++) {
                        if (_farList.ID) {
                            _sonList[i].PrevID = _farList.ID;

                        }
                        else {
                            _sonList[i].PrevID = 0;
                        }
                        _sonList[i].OrderID -= 1;
                        replaceArray(_data, _sonList);
                        var _list = iteration(data, _sonList[i].ID, []);
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].OrderID -= 1;
                        }
                        replaceArray(_data, _list);
                    }
                    spareData.PrevID = _tdata.PrevID;
                    spareData.OrderID = _tdata.OrderID;
                    replaceArray(_data, [spareData]);
                    _data.push(spareData);
                }
            }
            return _data;
        }
        //清除画布并重新绘制流程
        var clearCloth = function (ctx, data, options_p, _dataInfo) {
            var _arrangeData = getXY(data, options_p.constant);
            checkData(_arrangeData.rect, _arrangeData, options_p, options_p.constant.offset);
            var _data = _arrangeData.rect;
            var _returnData = {};
            //重新绘制流程
            for (var i = 0; i < _data.length; i++) {
                if (_data[i].ID == _dataInfo.ID) {
                    if (_data[i].Type == 1) {
                        //画方格
                        coordinate = drawRect({
                            ctx: ctx,
                            X: _data[i].X - options_p.constant.rect_width / 2,
                            Y: _data[i].Y - options_p.constant.rect_height / 2,
                            color: "#E0E0E0",
                            constant: options_p.constant,
                        });
                    }
                    if (_data[i].Type == 2) {
                        //画菱形
                        drawEllipse(
                             ctx,
                             _data[i].X,
                             _data[i].Y,
                             "#E0E0E0",
                             options_p.constant
                         );
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                    }
                    if (_data[i].Type == 3) {
                        //画椭圆
                        drawDiamond(
                             ctx,
                             _data[i].X,
                             _data[i].Y,
                             "#E0E0E0",
                             options_p.constant
                         );
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                    }
                    //画文字
                    var x = Xposition(_data[i][options_p.dataSet.Text].length, options_p.constant);
                    drawText({
                        ctx: ctx,
                        color: _data[i][options_p.dataSet.FGC] || options_p.text_color,
                        text: _data[i][options_p.dataSet.Text],
                        X: coordinate.X + x,
                        Y: coordinate.Y + options_p.constant.rect_height / 2 + options_p.constant.fontSize / 2,
                        constant: options_p.constant
                    });
                    continue;
                }
                if (!_data[i].isSpare) {
                    if (_data[i].Type == 1) {
                        //画方格
                        coordinate = drawRect({
                            ctx: ctx,
                            X: _data[i].X - options_p.constant.rect_width / 2,
                            Y: _data[i].Y - options_p.constant.rect_height / 2,
                            color: _data[i][options_p.dataSet.BGC] || options_p.background_color,
                            constant: options_p.constant,
                        });
                    }
                    if (_data[i].Type == 2) {
                        //画菱形
                        drawEllipse(
                             ctx,
                             _data[i].X,
                             _data[i].Y,
                             _data[i][options_p.dataSet.BGC] || options_p.background_color,
                             options_p.constant
                         );
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                    }
                    if (_data[i].Type == 3) {
                        //画椭圆
                        drawDiamond(
                             ctx,
                             _data[i].X,
                             _data[i].Y,
                             _data[i][options_p.dataSet.BGC] || options_p.background_color,
                             options_p.constant
                         );
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                    }
                    //画文字
                    var x = Xposition(_data[i][options_p.dataSet.Text].length, options_p.constant);
                    drawText({
                        ctx: ctx,
                        color: _data[i][options_p.dataSet.FGC] || options_p.text_color,
                        text: _data[i][options_p.dataSet.Text],
                        X: coordinate.X + x,
                        Y: coordinate.Y + options_p.constant.rect_height / 2 + options_p.constant.fontSize / 2,
                        constant: options_p.constant
                    });
                } else {
                    if (_data[i].Type == 1) {
                        drawBorder(ctx, _data[i].X - options_p.constant.rect_width / 2, _data[i].Y - options_p.constant.rect_height / 2, options_p.constant.dragColor, options_p.constant, _data[i].Type);
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                        _returnData.X = coordinate.X;
                        _returnData.Y = coordinate.X;
                        _returnData.Type = _data[i].Type;
                    }
                    if (_data[i].Type == 2 || _data[i].Type == 3) {
                        drawBorder(ctx, _data[i].X, _data[i].Y, options_p.constant.dragColor, options_p.constant, _data[i].Type);
                        coordinate.X = _data[i].X - options_p.constant.rect_width / 2;
                        coordinate.Y = _data[i].Y - options_p.constant.rect_height / 2;
                        _returnData.X = _data[i].X;
                        _returnData.Y = data[i].Y;
                        _returnData.Type = _data[i].Type;
                    }
                    //画文字
                    var x = Xposition(_data[i][options_p.dataSet.Text].length, options_p.constant);
                    drawText({
                        ctx: ctx,
                        color: options_p.constant.dragColor,
                        text: _data[i][options_p.dataSet.Text],
                        X: coordinate.X + x,
                        Y: coordinate.Y + options_p.constant.rect_height / 2 + options_p.constant.fontSize / 2,
                        constant: options_p.constant
                    });
                }
            }

            var overPoint = 0;
            for (var i = 0; i < _arrangeData.line.length; i++) {
                if (_arrangeData.line[i] == "overMainLine") {
                    overPoint = i;
                }
            }

            for (var i = 0; i < _arrangeData.line.length; i++) {
                if (i < overPoint) {
                    for (var j = 0; j < _arrangeData.line[i].length; j++) {
                        if (j > 0) {
                            drawLineForPoint(ctx,
                              _arrangeData.line[i][j - 1].X,
                              _arrangeData.line[i][j - 1].Y,
                              _arrangeData.line[i][j].X,
                              _arrangeData.line[i][j].Y,
                              options_p.foreground_color,
                              options_p.constant);
                            if (_arrangeData.line[i].length > 2) {
                                if (j==_arrangeData.line[i].length-1)
                                drawArrowForPoint(ctx, _arrangeData.line[i][j - 1].X, _arrangeData.line[i][j - 1].Y, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, options_p.foreground_color, options_p.constant);
                            } else {
                                if (_arrangeData.line[i][1].X == _arrangeData.line[i][0].X) {
                                    drawArrow(ctx, _arrangeData.line[i][1].X, _arrangeData.line[i][1].Y, "bottom", options_p.foreground_color, options_p.constant);
                                } else {
                                    drawArrow(ctx, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, "right", options_p.foreground_color, options_p.constant);
                                }
                            }
                        }
                    }
                } else if (i == overPoint) {
                    continue;
                } else if (i > overPoint) {
                    for (var j = 0; j < _arrangeData.line[i].length; j++) {
                        if (j > 0) {
                            if (options_p.constant.dottedLine) {
                                drawDottedLine(ctx, _arrangeData.line[i][j - 1].X, _arrangeData.line[i][j - 1].Y,
                                    _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y,
                                    options_p.foreground_color, 2, 5);
                                if (_arrangeData.line[i].length > 2) {
                                    if ( j==_arrangeData.line[i].length-1)
                                    drawArrowForPoint(ctx, _arrangeData.line[i][j - 1].X, _arrangeData.line[i][j - 1].Y, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, options_p.foreground_color, options_p.constant);
                                } else {
                                    if (_arrangeData.line[i][1].X == _arrangeData.line[i][0].X) {
                                        drawArrow(ctx, _arrangeData.line[i][1].X, _arrangeData.line[i][1].Y, "bottom", options_p.foreground_color, options_p.constant);
                                    } else {
                                        drawArrow(ctx, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, "right", options_p.foreground_color, options_p.constant);
                                    }
                                }
                            } else {
                                drawLineForPoint(ctx,
                                    _arrangeData.line[i][j - 1].X,
                                    _arrangeData.line[i][j - 1].Y,
                                    _arrangeData.line[i][j].X,
                                    _arrangeData.line[i][j].Y,
                                    options_p.foreground_color,
                                    options_p.constant);
                                if (_arrangeData.line[i].length > 2) {
                                    if (j==_arrangeData.line[i].length -1) 
                                    drawArrowForPoint(ctx, _arrangeData.line[i][j - 1].X, _arrangeData.line[i][j - 1].Y, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, options_p.foreground_color, options_p.constant);
                                } else {
                                    if (_arrangeData.line[i][1].X == _arrangeData.line[i][0].X) {
                                        drawArrow(ctx, _arrangeData.line[i][1].X, _arrangeData.line[i][1].Y, "bottom", options_p.foreground_color, options_p.constant);
                                    } else {
                                        drawArrow(ctx, _arrangeData.line[i][j].X, _arrangeData.line[i][j].Y, "right", options_p.foreground_color, options_p.constant);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return _returnData;
        }
        //鼠标松开后，判断位置
        var ReleaseEvnt = function (x, y, data, dataInfo, constant) {
            var _sonList = [];
            var _farList = {};
            var _data = $com.util.Clone(data);
            var leftData;//左边第一个
            var rightData = {};//右边第一个
            //不需要变动的情况
            if ((x >= dataInfo.X && x - dataInfo.X <= constant.rect_width / 2 + constant.levelSpace) || (x <= dataInfo.X && dataInfo.X - x <= constant.rect_width / 2 + constant.levelSpace)) {
                if (((y >= dataInfo.Y && y - dataInfo.Y <= constant.rect_height) || (y <= dataInfo.Y && dataInfo.Y - y <= constant.rect_height))) {
                    return _data;
                }
            }
            //第一步：判断松开位置的左边是谁（结合垂直一起判断）
            for (var i = 0; i < data.length; i++) {
                if (data[i].X < x && x - data[i].X <= constant.levelSpace + constant.rect_width / 2) {
                    if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height / 2) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height / 2))) {
                        leftData = data[i];
                    }
                }
            }
            if (leftData) {
                //第二步：结合位置来处理数据，并返回
                //需要移动的格子相关的数据做处理
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PrevID == dataInfo.ID) {
                        _sonList.push(data[i]);
                    }
                    if (data[i].ID == dataInfo.PrevID) {
                        _farList = data[i];
                    }
                }
                for (var i = 0; i < _sonList.length; i++) {
                    if (_farList.ID) {
                        _sonList[i].PrevID = _farList.ID;

                    }
                    else {
                        _sonList[i].PrevID = 0;
                    }
                    _sonList[i].OrderID -= 1;
                    replaceArray(_data, _sonList);
                    var _list = iteration(data, _sonList[i].ID, []);
                    for (var j = 0; j < _list.length; j++) {
                        _list[j].OrderID -= 1;
                    }
                    replaceArray(_data, _list);
                }
                //水平左边一个数据相关的做处理
                //求X轴相等的坐标的子集
                for (var i = 0; i < data.length; i++) {
                    if (leftData.ID == data[i].PrevID) {
                        rightData = data[i];
                        rightData.OrderID += 1;
                        replaceArray(_data, [rightData]);
                        var _list = iteration(data, rightData.ID, []);
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].OrderID += 1;
                        }
                        replaceArray(_data, _list);
                        break;
                    }
                }
                rightData.PrevID = dataInfo.ID;
                dataInfo.PrevID = leftData.ID;
                dataInfo.OrderID = leftData.OrderID + 1;
                replaceArray(_data, [dataInfo]);
            } else {//当左边没有流程的时候
                //判断右边有没有流程
                var _rdata;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].X > x && data[i].X - x < (constant.rect_width / 2 + constant.levelSpace)) {
                        if (((y >= data[i].Y && y - data[i].Y <= constant.rect_height / 2) || (y <= data[i].Y && data[i].Y - y <= constant.rect_height / 2))) {
                            _rdata = data[i];
                        }
                    }
                }
                if (_rdata) {
                    //第二步：结合位置来处理数据，并返回
                    //需要移动的格子相关的数据做处理
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].PrevID == dataInfo.ID) {
                            _sonList.push(data[i]);
                        }
                        if (data[i].ID == dataInfo.PrevID) {
                            _farList = data[i];
                        }
                    }
                    for (var i = 0; i < _sonList.length; i++) {
                        if (_farList.ID)
                            _sonList[i].PrevID = _farList.ID;
                        else
                            _sonList[i].PrevID = 0;
                        _sonList[i].OrderID -= 1;
                        replaceArray(_data, _sonList);
                        var _list = iteration(data, _sonList[i].ID, []);
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].OrderID -= 1;
                        }
                        replaceArray(_data, _list);
                    }

                    dataInfo.PrevID = _rdata.PrevID;
                    if (_rdata.PrevID || _rdata.OrderID == 1) {
                        _rdata.OrderID += 1;
                        _rdata.PrevID = dataInfo.ID;
                    }
                    if (!_rdata.PrevID && _rdata.OrderID > 1) {
                        _rdata.PrevID = dataInfo.ID;
                    }

                    replaceArray(_data, [_rdata]);
                    var _list = iteration(data, _rdata.ID, []);
                    for (var j = 0; j < _list.length; j++) {
                        _list[j].OrderID += 1;
                    }
                    replaceArray(_data, _list);

                    dataInfo.OrderID = _rdata.OrderID - 1;
                    replaceArray(_data, [dataInfo]);
                } else {
                    var _tdata;
                    for (var i = 0; i < data.length; i++) {
                        if ((x >= data[i].X && x - data[i].X <= constant.rect_width / 2 + constant.levelSpace) || (x <= data[i].X && data[i].X - x <= constant.rect_width / 2 + constant.levelSpace)) {
                            if (y >= data[i].Y && y - data[i].Y - constant.rect_height / 2 <= constant.rect_height) {
                                //if (((y >= data[i].Y && y - data[i].Y - constant.rect_height / 2 <= constant.rect_height) || (y <= data[i].Y && data[i].Y - y - constant.rect_height / 2 <= constant.rect_height))) {
                                _tdata = data[i];
                            }
                        }
                    }
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].PrevID == dataInfo.ID) {
                            _sonList.push(data[i]);
                        }
                        if (data[i].ID == dataInfo.PrevID) {
                            _farList = data[i];
                        }
                    }
                    for (var i = 0; i < _sonList.length; i++) {
                        if (_farList.ID) {
                            _sonList[i].PrevID = _farList.ID;

                        }
                        else {
                            _sonList[i].PrevID = 0;
                        }
                        _sonList[i].OrderID -= 1;
                        replaceArray(_data, _sonList);
                        var _list = iteration(data, _sonList[i].ID, []);
                        for (var j = 0; j < _list.length; j++) {
                            _list[j].OrderID -= 1;
                        }
                        replaceArray(_data, _list);
                    }
                    dataInfo.PrevID = _tdata.PrevID;
                    dataInfo.OrderID = _tdata.OrderID;
                    replaceArray(_data, [dataInfo]);
                }
            }
            return _data;
        }
        //用子数组替换总数组
        var replaceArray = function (farlist, sonlist) {
            for (var i = 0; i < farlist.length; i++) {
                for (var j = 0; j < sonlist.length; j++) {
                    if (farlist[i].ID == sonlist[j].ID) {
                        farlist[i] = sonlist[j];
                    }
                }
            }
        }
        //根据鼠标的实时移动画格子以及格子里面的文字
        var againDrawRect = function (x, y, target, ctx, options_p,e) {
            //cv = $(document).scrollTop();
            //cl = $(document).scrollLeft();
            //if (x - cl >= $(document.body).width() - 20) {
                
  
            //}
            //if (x - cl <= 20) {
            //    $(document).scrollLeft(scrollMove);
            //    scrollSpace += 5;
            //    scrollMove -= scrollMove;
            //    scrollSpace = true;
            //    return;
            //}
            var coordinate = {};
            if (target.Type == 1) {
                //画方格
                coordinate = drawRect({
                    ctx: ctx,
                    X: x - options_p.constant.rect_width / 2,
                    Y: y - options_p.constant.rect_height / 2,
                    color: target[options_p.dataSet.BGC] || options_p.background_color,
                    constant: options_p.constant,
                });
            }
            if (target.Type == 2) {
                //画椭圆
                drawEllipse(
                     ctx,
                     x,
                     y,
                     target[options_p.dataSet.BGC] || options_p.background_color,
                     options_p.constant
                 );
                coordinate.X = x - options_p.constant.rect_width / 2;
                coordinate.Y = y - options_p.constant.rect_height / 2;
            }
            if (target.Type == 3) {
                //画菱形
                drawDiamond(
                     ctx,
                     x,
                     y,
                     target[options_p.dataSet.BGC] || options_p.background_color,
                     options_p.constant
                 );
                coordinate.X = x - options_p.constant.rect_width / 2;
                coordinate.Y = y - options_p.constant.rect_height / 2;
            }
            //画文字
            var xspace = Xposition(target[options_p.dataSet.Text].length, options_p.constant);
            drawText({
                ctx: ctx,
                color: target[options_p.dataSet.FGC] || options_p.text_color,
                text: target[options_p.dataSet.Text],
                X: coordinate.X + xspace,
                Y: coordinate.Y + options_p.constant.rect_height / 2 + options_p.constant.fontSize / 2,
                constant: options_p.constant
            });
        }
        //判断鼠标按压的地方是否在流程格子里面
        var isRouteRect = function (x, y, data, constant) {
            var obj = {
                bool: false,
                dataInfo: {},
            }
            for (var i = 0; i < data.length; i++) {
                if (x > data[i].X - constant.rect_width / 2 && x < data[i].X - constant.rect_width / 2 + constant.rect_width && y > data[i].Y - constant.rect_height / 2 && y < data[i].Y - constant.rect_height / 2 +
                    constant.rect_height) {
                    obj.bool = true;
                    obj.dataInfo = data[i];
                }
            }
            
            return obj;
        }
        //处理数据
        var checkData = function (data, obj, options_p, offset) {
            //添加二维坐标xy
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
            obj.line.push("overMainLine");
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
                            handleLine.LineRepeatHandle(list, offset, obj);
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
            isAddOffset: function (list, xtlisted, obj) {
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
                    drawArrow(ctx, x1, y2, "bottom", color, constant);
                } else {
                    var space = y1 - y2;
                    drawArrow(ctx, x1, y1, "top", color, constant);
                }
            }
            if (y1 == y2) {
                if (x1 > x2) {
                    var space = x1 - x2;
                    drawArrow(ctx, x1, y2, "left", color, constant);
                } else {
                    var space = x2 - x1;
                    drawArrow(ctx, x2, y2, "right", color, constant);
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
            var bool = true;
            var _orderData = [];//排序后的数据
            //判断数据合法性
            for (var i = 0; i < data.length; i++) {
                if (data[i].PrevID != 0) {
                    // var obj = getInfo(data[i].PrevID, data);
                    // if (obj.OrderID != data[i].OrderID - 1) {
                    //     alert("id为（ " + data[i].ID + " ）数据格式错误！");
                    //     return;
                    // }
                }
                if (data[i].Type < 1 || data[i].Type > 3) {
                    alert("type格式不合法");
                    return;
                }
            }
            _orderData = getOrder(data);
            var X = constant.margin_left;//第一个流程水平位置
            var Y = constant.margin_top;//第一个流程竖直位置
            var XJ = constant.levelSpace + constant.rect_width;//X扩容距离
            var YJ = constant.verticalSpace + constant.rect_height;//Y扩容距离
            var Listed = [];//画方格集合
            var xtListed = [];//画线条集合
            for (var i = 0; i < _orderData.length; i++) {
                _orderData[i].X = X + (_orderData[i].OrderID - 1) * XJ;
                _orderData[i].Y = Y;
                //判断此X已经存在的最大Y
                for (var j = 0; j < Listed.length; j++) {
                    if (Listed[j].X == _orderData[i].X && Listed[j].Y >= _orderData[i].Y && Listed[j].ID != _orderData[i].PrevID)
                        _orderData[i].Y = Listed[j].Y + YJ;
                    //判断x不存在，并且存在上一层的子集
                    if (Listed[j].ID == _orderData[i].PrevID) {
                        _orderData[i].Y = Listed[j].Y;
                    }
                }
                //判断此点位置为扩容位置
                var IsOwn = false;
                var _far = {};
                for (var j = 0; j < Listed.length; j++) {
                    if (Listed[j].PrevID == _orderData[i].PrevID && Listed[j].PrevID != 0 && _orderData[i].PrevID != 0)
                        IsOwn = true;
                    if (Listed[j].ID == _orderData[i].PrevID)
                        _far = Listed[j];
                }
                //画主线
                if (IsOwn) {
                    handleLine.CY(Listed, _orderData[i].Y, YJ, xtListed);
                    xtListed.push(
                       [{ X: _far.X + constant.rect_width / 2, Y: _far.Y, }, //X1: _far.X + rect_width / 2 + levelSpace / 2, Y1: _far.Y 
                            { X: _far.X + constant.rect_width / 2 + constant.levelSpace / 2, Y: _far.Y },
                            { X: _far.X + constant.rect_width / 2 + constant.levelSpace / 2, Y: _orderData[i].Y },
                            { X: _orderData[i].X - constant.rect_width / 2, Y: _orderData[i].Y }]
                     );
                } else {
                    if (_orderData[i].PrevID != 0)
                        xtListed.push([{ X: _far.X + constant.rect_width / 2, Y: _far.Y }, { X: _orderData[i].X - constant.rect_width / 2, Y: _orderData[i].Y }]);
                }
                Listed.push(_orderData[i]);
            }
            var obj = {
                line: xtListed,
                rect: Listed,
            };
            return obj;
        }
        //给数据以正确的格式排序
        var getOrder = function (data) {
            var _returnList = [];
            var _relevantList = [];
            var _firstOrderList = [];
            var _ortherlist = [];
            var _list = $com.util.Clone(data);
            var _maxOrder = 0;
            var bool = false;
            //第一步：获取第一层的所有数据
            for (var i = 0; i < data.length; i++) {
                if (data[i].OrderID == 1) {
                    _firstOrderList.push(data[i]);
                }
            }
            //第二步：获取第一层所有数据的相关数据，并装入数组
            for (var i = 0; i < _firstOrderList.length; i++) {
                var _data = iteration(data, _firstOrderList[i].ID, []);
                _data.splice(0, 0, _firstOrderList[i]);
                _relevantList = _relevantList.concat(_data);
            }
            //第三步：获取出不相关的数据
            for (var i = 0; i < _list.length; i++) {
                for (var j = 0; j < _relevantList.length; j++) {
                    if (_list[i].ID == _relevantList[j].ID) {
                        _list[i].bool = true;
                    }
                }
            }
            for (var i = 0; i < _list.length; i++) {
                if (!_list[i].bool)
                    _ortherlist.push(_list[i]);
            }
            //_//ortherlist = _list;
            //第四步：按照层级顺序装载数据
            //找出最大层级
            for (var i = 0; i < data.length; i++) {
                if (data[i].OrderID > _maxOrder) {
                    _maxOrder = data[i].OrderID
                }
            }
            for (var i = 1; i <= _maxOrder; i++) {
                for (var j = 0; j < _relevantList.length; j++) {
                    if (_relevantList[j].OrderID == i) {
                        _returnList.push(_relevantList[j]);
                    }
                }
                for (var j = 0; j < _ortherlist.length; j++) {
                    if (_ortherlist[j].OrderID == i) {
                        _returnList.push(_ortherlist[j]);
                    }
                }
            }
            return _returnList;
        }
        //迭代找子级
        var iteration = function (data, targetID, list) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].PrevID == targetID) {
                    list.push(data[i]);
                    iteration(data, list[list.length - 1].ID, list);
                }
            }
            return list;
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
            ctx.closePath();
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
            
            //alert(cv + "   " + cl);
            var x = event.clientX - rect.left * (canvas1.width / rect.width),
                y = event.clientY - rect.top * (canvas1.height / rect.height);
            for (var i = 0; i < list.length; i++) {
                if (x > list[i].X - data1.constant.rect_width / 2 && x < list[i].X - data1.constant.rect_width / 2 + data1.constant.rect_width
                    && y > list[i].Y - data1.constant.rect_height / 2 && y < list[i].Y - data1.constant.rect_height / 2 +
                   data1.constant.rect_height) {
                    var targetData = list[i];
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
        //点击改变支线
        var changeLine_click = function (canvas2, event, list, data1, canvasLeft, canvasTop, $contain) {
            var cxt = canvas2.getContext("2d");
            var rect = canvas2.getBoundingClientRect();
            cv = $(document).scrollTop();
            cl = $(document).scrollLeft();
            var x = event.clientX - rect.left * (canvas2.width / rect.width),
                y = event.clientY - rect.top * (canvas2.height / rect.height) ;
            for (var i = 0; i < list.rect.length; i++) {
                if (x > list.rect[i].X - data1.constant.rect_width / 2 && x < list.rect[i].X - data1.constant.rect_width / 2 + data1.constant.rect_width
                    && y > list.rect[i].Y - data1.constant.rect_height / 2 && y < list.rect[i].Y - data1.constant.rect_height / 2 +
                   data1.constant.rect_height) {
                    var targetData = list.rect[i];
                    getFrame(targetData, canvasLeft, canvasTop, data1, canvas2, $contain, list.line);
                }
            }
        }
        var return_click = function (canvas1, event, list, data1, canvasLeft, canvasTop) {
            var cxt = canvas1.getContext("2d");
            var rect = canvas1.getBoundingClientRect();
            cv = $(document).scrollTop();
            cl = $(document).scrollLeft();
            var x = event.clientX - rect.left * (canvas1.width / rect.width),
                y = event.clientY - rect.top * (canvas1.height / rect.height);
            for (var i = 0; i < list.length; i++) {
                if (x > list[i].X - data1.constant.rect_width / 2 && x < list[i].X - data1.constant.rect_width / 2 + data1.constant.rect_width
                    && y > list[i].Y - data1.constant.rect_height / 2 && y < list[i].Y - data1.constant.rect_height / 2 +
                   data1.constant.rect_height) {
                    var targetData = list[i];
                    target = targetData;
                    alert("已选中" + target.KKK);
                    $("#_canvas2").remove();
                } else {
                    $("#_canvas2").remove();
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
        //
        //画金色边框
        var drawBorder = function (ctx, x, y, color, constant, type) {
            if (type == 1) {
                ctx.beginPath();
                ctx.moveTo(x, y + constant.radius);
                ctx.lineTo(x, y + constant.rect_height - constant.radius);
                ctx.quadraticCurveTo(x, y + constant.rect_height, x + constant.radius, y + constant.rect_height);
                ctx.lineTo(x + constant.rect_width - constant.radius, y + constant.rect_height);
                ctx.quadraticCurveTo(x + constant.rect_width, y + constant.rect_height, x + constant.rect_width, y + constant.rect_height -
                    constant.radius);
                ctx.lineTo(x + constant.rect_width, y + constant.radius);
                ctx.quadraticCurveTo(x + constant.rect_width, y, x + constant.rect_width - constant.radius, y);
                ctx.lineTo(x + constant.radius, y);
                ctx.quadraticCurveTo(x, y, x, y + constant.radius);
                ctx["stroke" + 'Style'] = color;
                ctx["stroke"]();
                ctx.closePath();
            }
            if (type == 2) {
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
                //fillStyle = color;//"#E2C1A7";
                ctx["stroke" + 'Style'] = color;
                ctx.stroke();
                ctx.closePath();
            }
            if (type == 3) {
                ctx.beginPath();
                ctx.moveTo(x - constant.rect_width / 2, y);
                ctx.lineTo(x, y - constant.rect_height / 2);
                ctx.lineTo(x + constant.rect_width / 2, y);
                ctx.lineTo(x, y + constant.rect_height / 2);
                ctx.lineTo(x - constant.rect_width / 2, y);
                ctx["stroke" + 'Style'] = color;
                ctx.stroke();
                ctx.closePath();
            }
        }
        //画汉字
        var drawText = function (data) {
            data.ctx.beginPath();
            data.ctx.font = data.constant.font;
            data.ctx.fillStyle = data.color;
            data.ctx.fillText(data.text, data.X, data.Y, data.constant.rect_width);
            data.ctx.closePath();
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
        //data:总数据，xy当前坐标，id目标id
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
