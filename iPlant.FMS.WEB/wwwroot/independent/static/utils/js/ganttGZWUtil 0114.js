define(['./jquery-3.1.1', './base/base'], function ($jQ, $com) {


    var position = {
        radius: 4,
        spacePx: 25.0,
        freedomPx: 150,
        contextHight: 100,
        tip: {
            title: { text: '订单', prop: 'PartNo', visible: true },
            line: [
                { text: '开始时间', prop: 'startDate', visible: true },
                { text: '时长', prop: 'time', visible: false }
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





    var LineX = 0;
    var canvas = undefined;
    var context = undefined;

    //  var canvasSource = [];

    var contextleft = undefined;

    var contexttop = undefined;

    var contextlefttop = undefined;

    //颜色库
    //var ColorClass = ['#3E90C6', '#3598DB', '#F29D0E', '#EA4B3E', '#BF392D', '#D15203', '#E84D3B', '#7E8C8D', '#C59BD7', '#8548A7', '#697787', '#91AB65', '#B0C97D', '#429FC0', '#6D7181'];

    var ColorClass = [  '#E84D3B', '#7E8C8D', '#C59BD7', '#8548A7', '#697787', '#91AB65', '#B0C97D', '#429FC0', '#6D7181'];
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
    //矩形位置数组
    var AllRectPosition = []

    var _Index = -1;

    //Install();
    var install = function (ContainDiv, ScrollContainDiv, positionIn) {

        var $scroll = $(' <div style=""></div>'),
            $canvas = $('<canvas style="border: 1px solid #DCE1E2;float: left;"></canvas>'),
            $canvasLeft = $('<div class="canvasLeft1" style="position:absolute;overflow: auto;" ><canvas></canvas></div>'),
            $canvasTop = $('<div class="canvasTop1" style="position:absolute;overflow: auto;" ><canvas></canvas></div>'),
            $canvaslefttop1 = $('<div class="canvaslefttop1" style="position:absolute;" ><canvas></canvas></div>');
        $scroll.html($canvas);

        $scroll.append($canvasTop);
        $scroll.append($canvasLeft);
        $scroll.append($canvaslefttop1);

        if (ContainDiv[0]) {
            ContainDiv.html($scroll);
        } else {
            ContainDiv = $(ContainDiv).html($scroll);
        }
       
        $canvasLeft[0].onmousewheel = function(event) {
            event = event || window.event;
            return false;
        };

        ScrollContainDiv.scroll(function (event) {
             
            var $this = $(this);
            var scroH = $this.scrollTop();  //滚动高度
            if (scroH > $this[0].scrollHeight) {
                scroH = $this[0].scrollHeight;
            }
            
            var scroW = $this.scrollLeft();
            $canvasTop.scrollLeft(scroW);
            if($canvasLeft.scrollTop()!=scroH){
                $canvasLeft.scrollTop(scroH);
            }
            
        });


        position = positionIn;

        //定义每天间隙
        space = parseFloat(positionIn.spacePx);

        //定义菜单栏区间
        freedom = positionIn.freedomPx;


        $canvaslefttop1.css("top", ScrollContainDiv.offset().top);
        $canvaslefttop1.css("left", ScrollContainDiv.offset().left);
        $canvaslefttop1.css("width", freedom);
        $canvaslefttop1.css("height", 52);




        //scroll = $scroll[0];
        canvas = $canvas[0];
        scroll = ScrollContainDiv[0];
        canvasLeft = $canvasLeft.find("canvas")[0];

        canvasTop = $canvasTop.find("canvas")[0];

        canvaslefttop = $canvaslefttop1.find("canvas")[0];
        //
        context = canvas.getContext('2d');

        contextleft = canvasLeft.getContext('2d');
        contexttop = canvasTop.getContext('2d');

        contextlefttop = $canvaslefttop1.find("canvas")[0].getContext('2d');

        //定义区间天数
        days = (new Date(position.series.data[1]) - new Date(position.series.data[0])) / 1000 / 24 / 3600;

        //定义区间周数
        weekDays = days / 7;
        if (days % 7 == 0)
            canvas.width = (days + 1) * space + freedom;
        else {
            canvas.width = (days + 1) * space + freedom;
        }
        if (position.contextHight)
            canvas.height = position.contextHight;

        radius = position.radius ? position.radius : radius;

        canvasLeft.height = canvas.height;
        canvasLeft.width = freedom;
        canvasTop.width = canvas.width;
        canvasTop.height = 52;

        //CanvasBasic();

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
            if (wDownRectResult.wIndex < 0)
                return false;
            //alert(eventDown_x);

            canvas.onmousemove = function (evt) {

                eventMove_x = evt.clientX + scrollX - canvas.offsetLeft;
                eventMove_y = evt.clientY + scrollY - canvas.offsetTop;


                var right = eventMove_x - eventDown_x;


                var day = right / space;

                //循环找到tree结构中的数据
                //循环找到tree结构中的数据
                for (var i = 0; i < position.Task.data.length; i++) {
                    $.each(position.Task.data[i].TaskPartList, function (j, jtem) {
                        $.each(jtem.TaskPartList, function (m, mtem) {
                            if (mtem.UniqueID == wDownRectResult.wIndex) {
                                //拖动矩形
                                if (wDownRectResult.wIsLeft == 2 && new Date(new Date(mtem.startDate).getTime() + (day * 24 * 3600000)) >= new Date(position.series.data[0]) && new Date(new Date(mtem.startDate).getTime()
                                    + ((mtem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000)) {

                                    mtem.startDate =
                                        new Date(new Date(mtem.startDate).getTime() + (day * 24 * 3600000));
                                }

                                if (day == 0)
                                    return;

                                // if (wDownRectResult.wIsLeft == -1 && day >= mtem.time)
                                //     return;

                                // if (wDownRectResult.wIsLeft == 1 && -day >= mtem.time)
                                //     return;

                                // if (wDownRectResult.wIsLeft == -1 &&
                                //     new Date(new Date(mtem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0]))
                                //     return;

                                // if (wDownRectResult.wIsLeft == 1 && new Date(new Date(mtem.startDate).getTime()
                                //     + ((mtem.time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000))
                                //     return;


                                // if (wDownRectResult.wIsLeft == -1) {
                                //     mtem.startDate =
                                //         new Date(new Date(mtem.startDate).getTime() + (day * 24 * 3600000));
                                //     mtem.time -= day;

                                // }
                                // else if (wDownRectResult.wIsLeft == 1) {
                                //     mtem.time += day;
                                //     if (mtem.time < 1) {
                                //         mtem.time = 1;
                                //     }
                                //     console.log(mtem);
                                // }

                                for (var i = 0; i < position.Task.data.length; i++) {
                                    $.each(position.Task.data[i].TaskPartList, function (t, ttem) {
                                        $.each(ttem.TaskPartList, function (p, ptem) {
                                            var pTime = new Date(ptem.startTime).getTime(),
                                                mTime = new Date(mtem.startTime).getTime(),
                                                pPartOrder = ptem.PartOrder,//
                                                mPartOrder = mtem.PartOrder,
                                                pLineID = ptem.LineID,
                                                mLineID = mtem.LineID;

                                            if (ptem.PartNo == mtem.PartNo && ptem.PartID != mtem.PartID) {
                                                if (position.effect.Time == 1 && position.effect.Part == 0) {

                                                    if (pTime >= mTime && pLineID == mLineID) {

                                                        // if (wDownRectResult.wIsLeft == 1) {
                                                        //     if (new Date(new Date(ptem.startDate).getTime()
                                                        //         + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000))
                                                        //         ptem.time += day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        // }
                                                        // if (wDownRectResult.wIsLeft == -1) {
                                                        //     ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                        //     ptem.time -= day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        //     //判断拖出界面
                                                        //     if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                        //         ptem.startDate = position.series.data[0];
                                                        //     }
                                                        // }
                                                        if (wDownRectResult.wIsLeft == 2) {
                                                            if (new Date(new Date(ptem.startDate).getTime()
                                                                + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000)) {
                                                                ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                                if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                                    ptem.startDate = position.series.data[0];
                                                                }
                                                            }

                                                        }
                                                    }

                                                } else if (position.effect.Time == 0 && position.effect.Part == 1) {

                                                    if (mPartOrder <= pPartOrder && pLineID == mLineID) {
                                                        // if (wDownRectResult.wIsLeft == 1) {
                                                        //     if (new Date(new Date(ptem.startDate).getTime()
                                                        //         + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000))
                                                        //         ptem.time += day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        //     //                         if(new Date(new Date(ptem.startDate).getTime()
                                                        //     // + ((ptem.time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000)){
                                                        //     //     continue;
                                                        //     // }
                                                        // }
                                                        // if (wDownRectResult.wIsLeft == -1) {
                                                        //     ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                        //     ptem.time -= day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        //     //判断拖出界面
                                                        //     if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                        //         ptem.startDate = position.series.data[0];
                                                        //     }
                                                        // }
                                                        if (wDownRectResult.wIsLeft == 2) {
                                                            if (new Date(new Date(ptem.startDate).getTime()
                                                                + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000)) {
                                                                ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                                if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                                    ptem.startDate = position.series.data[0];
                                                                }
                                                            }
                                                            //                         if(new Date(new Date(ptem.startDate).getTime()
                                                            // + ((ptem.time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000)){
                                                            //     continue;
                                                            // }
                                                        }
                                                    }
                                                }
                                                else if (position.effect.Time == 1 && position.effect.Part == 1) {

                                                    if (mPartOrder <= pPartOrder && pTime >= mTime && pLineID == mLineID) {
                                                        // if (wDownRectResult.wIsLeft == 1) {
                                                        //     if (new Date(new Date(ptem.startDate).getTime()
                                                        //         + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000))
                                                        //         ptem.time += day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        //     //                         if(new Date(new Date(ptem.startDate).getTime()
                                                        //     // + ((ptem.time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000)){
                                                        //     //     continue;
                                                        //     // }
                                                        // }
                                                        // if (wDownRectResult.wIsLeft == -1) {
                                                        //     ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                        //     ptem.time -= day;
                                                        //     if (ptem.time <= 1) {
                                                        //         ptem.time = 1;
                                                        //     }
                                                        //     //判断拖出界面
                                                        //     if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                        //         ptem.startDate = position.series.data[0];
                                                        //     }
                                                        // }
                                                        if (wDownRectResult.wIsLeft == 2) {
                                                            if (new Date(new Date(ptem.startDate).getTime()
                                                                + ((ptem.time + day) * 24 * 3600000)) <= new Date(new Date(position.series.data[1]).getTime() + 24 * 3600000)) {
                                                                ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                                if (new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000 - 8 * 3600000)) < new Date(position.series.data[0])) {
                                                                    ptem.startDate = position.series.data[0];
                                                                }
                                                            }
                                                            //                         if(new Date(new Date(ptem.startDate).getTime()
                                                            // + ((ptem.time + day) * 24 * 3600000)) > new Date(new Date(position.series.data[1]).getTime() + 8 * 3600000)){
                                                            //     continue;
                                                            // }
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (pLineID == mLineID && pTime >= mTime && mPartOrder <= pPartOrder) {
                                                        // if(wDownRectResult.wIsLeft == 1){
                                                        //     ptem.time += day;
                                                        // }
                                                        // if(wDownRectResult.wIsLeft == -1){
                                                        //     ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                        //     ptem.time -= day;
                                                        // }
                                                        // if(wDownRectResult.wIsLeft == 2){
                                                        //     ptem.startDate = new Date(new Date(ptem.startDate).getTime() + (day * 24 * 3600000));
                                                        // }
                                                    }

                                                }

                                            }
                                        });
                                    });
                                };

                            }
                            ResfushCanvas(position.Task.data);
                            eventDown_x = eventMove_x;

                        });

                    });
                }


            }

        };

        canvas.onmouseup = function (evt) {

            //所有日期 时长 四舍五入


            //重绘

            temp = false;

            canvas.onmousemove = function () { };

            for (var i = 0; i < position.Task.data.length; i++) {
                $.each(position.Task.data[i].TaskPartList, function (j, jtem) {
                    $.each(jtem.TaskPartList, function (m, mtem) {

                        if (!(mtem.startDate instanceof Date))
                            mtem.startDate = new Date(mtem.startDate);

                        var time = mtem.startDate.getTime();

                        mtem.startDate = new Date(Math.round(mtem.startDate.getTime() / (24 * 3600000)) * (24 * 3600000));

                        if (time != mtem.startDate.getTime()) {
                            mtem.time += ((time - mtem.startDate.getTime()) / (24 * 3600000));
                        }
                        mtem.time = Math.round(mtem.time);

                    });
                });
            };

            ResfushCanvas(position.Task.data);
            if (_Index >= 0 && position.fn)
                position.fn(position.Task.data);
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
                ResfushCanvas(position.Task.data);
                this.style.cursor = 'default';
            }
            // if (zzz.wIsLeft == -1 || zzz.wIsLeft == 1) {
            //     ResfushCanvas(position.Task.data);
            //     this.style.cursor = 'w-resize';
            // }
            if (zzz.wIsLeft == 2) {
                this.style.cursor = 'pointer';
                ResfushCanvas(position.Task.data);
                Tips(eventOver_x, eventOver_y, zzz.wIndex);
            }

        });
    };

    //画布上绘制任务时间矩形
    var ResfushCanvasOne = function (obj) {

        var rectStart_X, rectStart_Y, rectWidth;

        if (!(obj.startDate instanceof Date))
            obj.startDate = new Date(obj.startDate);


        //时间任务矩形
        rectStart_X = freedom + (((obj.startDate.getTime() - new Date(position.series.data[0]).getTime()) / (24 * 3600000)) * space);
        //rectStart_X = freedom + (((obj.startDate - new Date(position.series.data[0])) / (24 * 3600000)) * space);

        rectStart_Y = TOPHEIGHT;
        if (obj.PartNo.length <= 0) {
            rectWidth = 0;
        }
        else {

            rectWidth = obj.time * space;
        }


        DrawRoundRect(rectStart_X, rectStart_Y, rectWidth, 25, radius, obj.color, obj.PartNo, obj.APSMessage);

        TOPHEIGHT = 25 + TOPHEIGHT;
        //向记录矩形位置数组中添加数据
        AllRectPosition.push(
            {
                ID: obj.UniqueID,
                Start_X: rectStart_X,
                Start_Y: rectStart_Y,
                rectWidth: rectWidth
            }
        )


    }
    var onceMore = true;
    //重绘画布
    var ResfushCanvas = function (data) {

        if (!data) {
            data = position.Task.data;
        }
        //清除Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        contextleft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);

        contexttop.clearRect(0, 0, canvasTop.width, canvasTop.height);

        contextlefttop.clearRect(0, 0, canvaslefttop.width, canvaslefttop.height);

        //定义orderID对应的颜色
        var orderNumber = [],
            orderColor = [],
            orderExc = [];

        //画数据
        TOPHEIGHT = 52;
        //工段高度
        PARTHEIGHT = 52;
        //产线高度
        LINEHEIGHT = 52;
        //s上次工段高度
        PREHEIGHT = 53;

        CanvasBasic();
        

        AllRectPosition = [];

        orderColor.push({ PartNo: data[0].TaskPartList[0].TaskPartList[0].PartNo, color: ColorClass[0] });

        var CORCOUNTS = 0;

        //给每条数据选中一个颜色
        $.each(data, function (j, jtem) {
            $.each(jtem.TaskPartList, function (k, ktem) {
                $.each(ktem.TaskPartList, function (m, mtem) {
                    if ($.inArray(mtem.PartNo, orderExc) < 0) {

                        orderExc.push(mtem.PartNo);

                    }
                });
            });
        });

        orderExc.sort();


        $.each(data, function (j, jtem) {
            $.each(jtem.TaskPartList, function (k, ktem) {
                $.each(ktem.TaskPartList, function (m, mtem) {
                    $.each(orderExc, function (n, ntem) {
                        if (ntem == mtem.PartNo)
                            mtem.color = ColorClass[n]
                    });
                    ResfushCanvasOne(mtem);
                });
                DrawPartPoint(TOPHEIGHT, ktem);
                PREHEIGHT = TOPHEIGHT;
            });
            DrawPart(TOPHEIGHT, jtem);
            PARTHEIGHT = TOPHEIGHT;
        });
    };
    //画基础日历表
    var CanvasBasic = function () {

        //     context.beginPath();

        //     //上部填充颜色
        //     context.beginPath();
        //     context.fillStyle = '#C8E3FF';
        //     context.fillRect(0, 0, freedom, 52);
        //     context.fillRect(freedom, 0, canvas.width, 18);
        //     context.fill();

        //     //上下部填充颜色
        //     context.fillStyle = '#E4F2FF';
        //     context.fillRect(freedom, 18, canvas.width, 35);
        //     context.fill();

        //     //alert(new Date(new Date().getYear(),new Date().getMonth()));
        //     //获取当月天数
        //     function getCountDays() {
        //         var curDate = new Date();
        //         /* 获取当前月份 */
        //         var curMonth = curDate.getMonth();
        //         /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        //         curDate.setMonth(curMonth + 1);
        //         /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        //         curDate.setDate(0);
        //         /* 返回当月的天数 */
        //         return curDate.getDate();
        //     }
        //     //获取当前月第一天
        //     function getCurrentMonthFirst() {

        //         var date = new Date()
        //         date.setDate(1)
        //         var month = parseInt(date.getMonth() + 1)
        //         var day = date.getDate()
        //         if (month < 10) {
        //             month = '0' + month
        //         }
        //         if (day < 10) {
        //             day = '0' + day
        //         }
        //         // YhckrjzStroe.setKsrq(date.getFullYear() + '-' + month + '-' + day)
        //         return date.getFullYear() + '-' + month + '-' + day
        //     }
        //     // 当前月最后一天
        //     function getCurrentMonthLast() {

        //         var date = new Date()
        //         var currentMonth = date.getMonth()
        //         var nextMonth = ++currentMonth
        //         var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        //         var oneDay = 1000 * 60 * 60 * 24
        //         var lastTime = new Date(nextMonthFirstDay - oneDay)
        //         var month = parseInt(lastTime.getMonth() + 1)
        //         var day = lastTime.getDate()
        //         if (month < 10) {
        //             month = '0' + month
        //         }
        //         if (day < 10) {
        //             day = '0' + day
        //         }
        //         // YhckrjzStroe.setJsrq(date.getFullYear() + '-' + month + '-' + day)
        //         return new Date(date.getFullYear() + '-' + month + '-' + day)
        //     }

        //     //计算天数
        //     function GetDays(startDate, endDate) {
        //         var days;
        //         days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
        //         return days;
        //     }

        //     var daycat=GetDays(position.series.data[0],position.series.data[1]);
        //     //alert(daycat);
        //     for (var i = 0; i <= daycat; i++) {
        //         //画年月份


        //         //context.strokeStyle = '#E9EEF6';
        //         //context.moveTo(i * 7 * space + freedom, 0);
        //         //context.lineTo(i * 7 * space + freedom, canvas.height);
        //         context.stroke();
        //     }

        //     context.beginPath();
        //     context.font = "bold 13px Arial";
        //     context.fillStyle = 'black';
        //     context.textAlign = 'center';
        //     context.textBaseline = 'alphabetic';
        //     //var z = addDate(position.series.data[0], i * 7);
        //     //context.fillText(getCurrentMonthFirst() + '--' + $com.util.format('yyyy-MM-dd', getCurrentMonthLast()), canvas.width / 2 + freedom, 15, canvas.width);
        //     context.fillText(position.series.data[0] + '--' + position.series.data[1], canvas.width / 2 + freedom, 15, canvas.width);
        //     context.fill();
        //     context.beginPath();


        //     var start = new Date(position.series.data[0].replace(/-/g,"/"));
        //     var end = new Date(position.series.data[1].replace(/-/g,"/"));


        //     for (var j = 0; j <= daycat; j++) {
        //         var curDate = new Date(new Date().getFullYear(), new Date().getMonth(), j+1);
        //         var catcounts = 0;
        //         //var date = new Date(item.WorkDate).getDay();
        //         context.font = "bold 13px Arial";
        //         context.fillStyle = 'black';
        //         //console.log(curDate);
        //         //s画星期上方日期
        //         if(j==0){
        //             do{

        //                 context.fillText(start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate(), space * catcounts + space / 2 + freedom, 31, space);

        //                 catcounts++;

        //                 start.setDate(start.getDate()+1);
        //             }while(end >= start);
        //         }


        //         if (true) {
        //             if (j % 7 == 0)
        //                 context.fillText("一", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 1)                                             
        //                 context.fillText("二", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 2)                                             
        //                 context.fillText("三", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 3)                                           
        //                 context.fillText("四", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 4)                                            
        //                 context.fillText("五", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 5)                                          
        //                 context.fillText("六", space * j + space / 2 + freedom, 49, space);
        //             if (j % 7 == 6)                                          
        //                 context.fillText("天", space * j + space / 2 + freedom, 49, space);
        //             context.fill();



        //             context.beginPath();
        //             context.strokeStyle = '#E9EEF6';
        //             context.moveTo(space * j + freedom, 18);
        //             context.lineTo(space * j + freedom, canvas.height);
        //             context.stroke();
        //             context.beginPath();
        //         }
        //         //画日期下竖线
        //         context.beginPath();
        //         context.strokeStyle = '#E9EEF6';
        //         context.moveTo(j * space + freedom, 18);
        //         context.lineTo(j * space + freedom, canvas.height);
        //         if (j == days) {
        //             context.strokeStyle = '#E9EEF6';
        //             context.moveTo((j + 1) * space + freedom, 18);
        //             context.lineTo((j + 1) * space + freedom, canvas.height);
        //         }
        //         context.stroke();
        //         context.closePath();

        //     }

        //     //context.beginPath();
        //     //context.strokeStyle = '#E9EEF6';
        //     //context.moveTo(space * (daycat + 2) + freedom, 18);
        //     //context.lineTo(space * (daycat + 2) + freedom, canvas.height);
        //     //context.stroke();
        //     //context.beginPath();

        //     //左侧上部字
        //     context.beginPath();
        //     context.fillStyle = 'black';

        //    // context.fillText("产线", 25, 49);
        //     context.fillText("工位", 80, 49);


        //     context.fillText("修程", 200, 49);
        //     context.fill();
        //     context.closePath();

        //     //画横线
        //     context.strokeStyle = 'DarkGray';
        //     context.moveTo(0, 35);
        //     context.lineTo(canvas.width + freedom, 35);
        //     context.moveTo(0 + freedom, 35);
        //     context.lineTo(canvas.width + freedom, 35);
        //     context.stroke();
        //     context.closePath();

        //菜单栏竖线
        //context.beginPath();
        //context.strokeStyle = 'green';
        //context.moveTo(150, 0);
        //context.lineTo(150, canvas.height);
        //context.stroke();
        //context.closePath();



        contexttop.beginPath();

        //上部填充颜色
        contexttop.beginPath();
        contexttop.fillStyle = '#C8E3FF';
        contexttop.fillRect(0, 0, freedom, 52);
        contexttop.fillRect(freedom, 0, canvas.width, 18);
        contexttop.fill();

        //上下部填充颜色
        contexttop.fillStyle = '#E4F2FF';
        contexttop.fillRect(freedom, 18, canvas.width, 35);
        contexttop.fill();

        //alert(new Date(new Date().getYear(),new Date().getMonth()));
        //获取当月天数
        function getCountDays() {
            var curDate = new Date();
            /* 获取当前月份 */
            var curMonth = curDate.getMonth();
            /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
            curDate.setMonth(curMonth + 1);
            /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
            curDate.setDate(0);
            /* 返回当月的天数 */
            return curDate.getDate();
        }
        //获取当前月第一天
        function getCurrentMonthFirst() {

            var date = new Date()
            date.setDate(1)
            var month = parseInt(date.getMonth() + 1)
            var day = date.getDate()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            // YhckrjzStroe.setKsrq(date.getFullYear() + '-' + month + '-' + day)
            return date.getFullYear() + '-' + month + '-' + day
        }
        // 当前月最后一天
        function getCurrentMonthLast() {

            var date = new Date()
            var currentMonth = date.getMonth()
            var nextMonth = ++currentMonth
            var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
            var oneDay = 1000 * 60 * 60 * 24
            var lastTime = new Date(nextMonthFirstDay - oneDay)
            var month = parseInt(lastTime.getMonth() + 1)
            var day = lastTime.getDate()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            // YhckrjzStroe.setJsrq(date.getFullYear() + '-' + month + '-' + day)
            return new Date(date.getFullYear() + '-' + month + '-' + day)
        }

        //计算天数
        function GetDays(startDate, endDate) {
            var days;
            days = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
            return days;
        }

        var daycat = GetDays(position.series.data[0], position.series.data[1]);
        //alert(daycat);
        for (var i = 0; i <= daycat; i++) {
            //画年月份


            //contexttop.strokeStyle = '#E9EEF6';
            //contexttop.moveTo(i * 7 * space + freedom, 0);
            //contexttop.lineTo(i * 7 * space + freedom, canvas.height);
            contexttop.stroke();
        }

        contexttop.beginPath();
        contexttop.font = "bold 13px Arial";
        contexttop.fillStyle = 'black';
        contexttop.textAlign = 'center';
        contexttop.textBaseline = 'alphabetic';
        //var z = addDate(position.series.data[0], i * 7);
        //contexttop.fillText(getCurrentMonthFirst() + '--' + $com.util.format('yyyy-MM-dd', getCurrentMonthLast()), canvas.width / 2 + freedom, 15, canvas.width);
        contexttop.fillText(position.series.data[0] + '--' + position.series.data[1], (canvas.width + freedom)/2, 15, canvas.width);
        contexttop.fill();
        contexttop.beginPath();


        var start = new Date(position.series.data[0].replace(/-/g, "/"));
      
        var end = new Date(position.series.data[1].replace(/-/g, "/"));


        for (var j = 0; j <= daycat; j++) {
            var curDate = new Date(new Date().getFullYear(), new Date().getMonth(), j + 1);
            var catcounts = 0;
            //var date = new Date(item.WorkDate).getDay();
            contexttop.font = "bold 13px Arial";
            contexttop.fillStyle = 'black';
            //console.log(curDate);
            //s画星期上方日期
            if (j == 0) {
                do {

                    contexttop.fillText(start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate(), space * catcounts + space / 2 + freedom, 31, space);

                    catcounts++;

                    start.setDate(start.getDate() + 1);
                } while (end >= start);
            }



            var ZaceStart=new Date(position.series.data[0].replace(/-/g, "/"));
            if (true) {
                var ZaceWeek=new Date(addDate(ZaceStart,j)).getDay();
                if (ZaceWeek % 7 == 1)
                    contexttop.fillText("一", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 2)
                    contexttop.fillText("二", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 3)
                    contexttop.fillText("三", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 4)
                    contexttop.fillText("四", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 5)
                    contexttop.fillText("五", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 6)
                    contexttop.fillText("六", space * j + space / 2 + freedom, 49, space);
                if (ZaceWeek % 7 == 0)
                    contexttop.fillText("日", space * j + space / 2 + freedom, 49, space);
                contexttop.fill();



                context.beginPath();
                context.strokeStyle = '#E9EEF6';
                context.moveTo(space * j + freedom, 18);
                context.lineTo(space * j + freedom, canvas.height);
                context.stroke();
                context.beginPath();
            }
            //画日期下竖线
            context.beginPath();
            context.strokeStyle = '#E9EEF6';
            context.moveTo(j * space + freedom, 18);
            context.lineTo(j * space + freedom, canvas.height);
            if (j == days) {
                context.strokeStyle = '#E9EEF6';
                context.moveTo((j + 1) * space + freedom, 18);
                context.lineTo((j + 1) * space + freedom, canvas.height);
            }
            context.stroke();
            context.closePath();
            contexttop.stroke();
            contexttop.closePath();

        }

        //contexttop.beginPath();
        //contexttop.strokeStyle = '#E9EEF6';
        //contexttop.moveTo(space * (daycat + 2) + freedom, 18);
        //contexttop.lineTo(space * (daycat + 2) + freedom, canvas.height);
        //contexttop.stroke();
        //contexttop.beginPath();

                //画竖线
                contextlefttop.beginPath();
                contextlefttop.fillStyle = 'DarkGray';
                contextlefttop.moveTo(150, 18);
                contextlefttop.lineTo(150, 52);
                contextlefttop.fill();
                contextlefttop.closePath();

         //上部填充颜色
         contextlefttop.beginPath();
         contextlefttop.fillStyle = '#C8E3FF';
         contextlefttop.fillRect(0, 0, freedom, 18);
         contextlefttop.fill();
 
         //上下部填充颜色
         contextlefttop.fillStyle = '#E4F2FF';
         contextlefttop.fillRect(0, 18, freedom, 35);
         contextlefttop.fill();

        contextlefttop.beginPath();
        contextlefttop.font = "bold 13px Arial";
        contextlefttop.fillStyle = 'black';
        // contexttop.fillText("产线", 25, 49);
        contextlefttop.fillText("工位", 40, 36);


        contextlefttop.fillText("修程", 188, 36);
        contextlefttop.fill();
        contextlefttop.closePath();
        //画横线
        // contextlefttop.strokeStyle = 'DarkGray';
        // contextlefttop.moveTo(0, 35);
        // contextlefttop.lineTo(freedom, 35);
        // contextlefttop.moveTo(0 + freedom, 52);
        // contextlefttop.lineTo(freedom, 52);
        // contextlefttop.stroke();
        // contextlefttop.closePath();

    }
   
    //画左侧修
    var DrawPartPoint = function (TOPHEIGHT, jtem) {
        contextleft.beginPath();
        contextleft.font = "bold 13px Arial";
        contextleft.fillStyle = 'black';

        contextleft.fillText(jtem.LineName, 190, (TOPHEIGHT - PREHEIGHT) / 2 + PREHEIGHT);

        //画表格竖线
        contextleft.beginPath();
        contextleft.strokeStyle = '#E9EEF6';
        //context.moveTo(200, 35);
        //context.lineTo(200, TOPHEIGHT);
        contextleft.moveTo(150, TOPHEIGHT);
        contextleft.lineTo(freedom, TOPHEIGHT);
        contextleft.stroke();
        contextleft.closePath();
    };
    //画左侧工段
    var DrawPart = function (TOPHEIGHT, jtem) {

        contextleft.beginPath();
        contextleft.font = "bold 13px Arial";
        contextleft.fillStyle = 'black';
        contextleft.fillText(jtem.PartName, 10, (TOPHEIGHT - PARTHEIGHT) / 2 + PARTHEIGHT);
        contextleft.fill();
        contextleft.closePath();

        //画表格竖线
        contextleft.beginPath();
        contextleft.strokeStyle = '#E9EEF6';
        contextleft.moveTo(150, 35);
        contextleft.lineTo(150, TOPHEIGHT);
        contextleft.moveTo(LineX, TOPHEIGHT);
        contextleft.lineTo(freedom, TOPHEIGHT);
        contextleft.stroke();
        contextleft.closePath();

    };
    var matching = 2.5;
    //圆角矩形
    var flag = false;
    var DrawRoundRect = function (x, y, width, height, radius, color, Name, str) {

        //context.canvas.

        context.beginPath();


        context.fillStyle = color;
        context.globalCompositeOperation = "source-over";
        context.arc(x + radius, y + 3 + radius, radius, Math.PI, Math.PI * 3 / 2);
        context.lineTo(width - radius + x, y + 3);
        context.arc(width - radius + x, radius + y + 3, radius, Math.PI * 3 / 2, Math.PI * 2);
        context.lineTo(width + x, height - 6 + y + 3 - radius);
        context.arc(width - radius + x, height - 6 - radius + y + 3, radius, 0, Math.PI * 1 / 2);
        context.lineTo(radius + x, height - 6 + y + 3);
        context.arc(radius + x, height - 6 - radius + y + 3, radius, Math.PI * 1 / 2, Math.PI);
        context.fill();

        context.strokeStyle = 'DarkGray';
        context.moveTo(freedom, y + 25);
        context.lineTo(canvas.width, y + 25);
        context.stroke();

        context.closePath();
        context.font = "bold 13px Arial";
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        //感叹号
        context.fillText(Name, x + width / 2, y + height / 2, width);

        //话斜杠
        if (str.length > 0) {
            context.beginPath();
            context.fillStyle = 'red';
            context.moveTo(x + width - 9, y + 5);
            context.lineTo(x + width - 1, y + height / 2 - 1);
            context.lineTo(x + width - 1, y + 5);
            context.lineTo(x + width - 9, y + 5);
            context.fill();
            context.closePath();
        }


        //context.fillStyle = 'blue';
        //context.fillText(position.Task.data[num].FQTY, 85 + (freedom - 85) / 3 * 2 + (freedom - 85) / 3 / 2 / 2, y + height / 2, width);
        //context.fillStyle = 'green';
        //context.fillText(position.Task.data[num].FQTYPL, 85 + (freedom - 85) / 3 * 2 + (freedom - 85) / 3 / 2 / 2 + (freedom - 85) / 3 / 2, y + height / 2, width);




    }

    //查找哪一个矩形
    var SearchMouseDownRect = function (m_x, m_y, data) {

        var wResult = { wIndex: -1, wIsLeft: 0 }

        for (var i = 0; i < AllRectPosition.length; i++) {
            var rectStart_Y1 = AllRectPosition[i].Start_Y,
                rectStart_X1 = AllRectPosition[i].Start_X,
                rectWidth1 = AllRectPosition[i].rectWidth;

            //判断某一行
            if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + 25) {
                continue;
            }
            wResult.wIndex = AllRectPosition[i].ID;

            //
            // if (m_x > rectStart_X1 - matching && m_x < rectStart_X1 + matching)
            //     wResult.wIsLeft = -1;
            // else if (m_x > rectStart_X1 + rectWidth1 - matching && m_x < rectStart_X1 + rectWidth1 + matching)
            //     wResult.wIsLeft = 1;
             if (m_x > rectStart_X1 + matching && m_x < rectStart_X1 + rectWidth1 - matching)
                wResult.wIsLeft = 2;
        }
        // var wResult = { wIndex: -1, wIsLeft: 0 }

        // for (var i = 0; i < AllRectPosition.length; i++) {
        //     var rectStart_Y1 = AllRectPosition[i].Start_Y,
        //         rectStart_X1 = AllRectPosition[i].Start_X,
        //         rectWidth1 = AllRectPosition[i].rectWidth;

        //     if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + space) {
        //         continue;
        //     }
        //     wResult.wIndex = AllRectPosition[i].ID;

        //     if (m_x > rectStart_X1 - matching && m_x < rectStart_X1 + matching)
        //         wResult.wIsLeft = -1;
        //     else if (m_x > rectStart_X1 + rectWidth1 - matching && m_x < rectStart_X1 + rectWidth1 + matching)
        //         wResult.wIsLeft = 1;
        //     else if (m_x > rectStart_X1 + matching && m_x < rectStart_X1 + rectWidth1 - matching)
        //         wResult.wIsLeft = 2;
        // }

        //for (var i = 0; i < data.length; i++) {

        //    var rectStart_X1 = freedom + ((new Date(data[i].startDate) - new Date(position.series.data[0])) / 1000 / 24 / 3600 * space);

        //    var rectStart_Y1 = 35 + i * space;

        //    var rectWidth1 = position.Task.data[i].time * space;

        //    //判断是那行数据
        //    if (m_y <= rectStart_Y1 || m_y >= rectStart_Y1 + space) {
        //        continue;
        //    }
        //    wResult.wIndex = i;

        //    if (m_x > rectStart_X1 - matching && m_x < rectStart_X1 + matching)
        //        wResult.wIsLeft = -1;
        //    else if (m_x > rectStart_X1 + rectWidth1 - matching && m_x < rectStart_X1 + rectWidth1 + matching)
        //        wResult.wIsLeft = 1;
        //    else if (m_x > rectStart_X1 + matching && m_x < rectStart_X1 + rectWidth1 - matching)
        //        wResult.wIsLeft = 2;
        //}
        return wResult;

    }

    var Tips = function (x, y, index) {

        var bool = true,
            mousex = x,
            mousey = y;


        for (var i = 0; i < position.Task.dataList.length; i++) {
            if (position.Task.dataList[i].UniqueID == index && bool) {
                //索引
                index = i;
                bool = false;
            }


        }
        var startDate = position.Task.dataList[index].StartTime,
            days = position.Task.dataList[index].time,
            TaskText = position.Task.dataList[index].TaskText,
            APSMessage = position.Task.dataList[index].APSMessage;


        var tipW = 300;
        var tipH = 100;
        var lineH = 15;
        var titleH = 30;
        var lengthSum = 0;


        tipW = position.tip.Text.tipW ? position.tip.Text.tipW : tipW;
        tipH = position.tip.Text.tipH ? position.tip.Text.tipH : tipH;
        lineH = position.tip.Text.lineH ? position.tip.Text.lineH : lineH;
        titleH = position.tip.Text.titleH ? position.tip.Text.titleH : titleH;

        if (APSMessage.length > 0) {
            lengthSum = APSMessage.length;
            //tipH = (lengthSum / 10 + 1) * lineH;
        }


        startDate = addDate(startDate, 0);
        context.font = "bold 15px Arial";
        context.fillStyle = 'black';
        context.textAlign = 'left';   //zace  左对齐
        // context.globalAlpha = 0.2;
        // context.fillRect(x, y, tipW, tipH);
        // context.fillStyle = 'black';
        context.globalAlpha = 1;

        y += 8;

        if (position.tip.title.visible) {
            context.fillText(position.tip.title.text + ":" + position.Task.dataList[index][position.tip.title.prop],
                x + 10, y + 8, tipW);
            y = y + titleH;
        }
        context.font = "bold 13px Arial";

        if (lengthSum > 0) {
            position.tip.line[3].visible = true;
        }
        else
            position.tip.line[3].visible = false;

        var  COUNTS = 0;
        for (var i = 0; i < position.tip.line.length; i++) {
            if (!position.tip.line[i].visible)
                continue;
            if (!(position.Task.dataList[index][position.tip.line[0].prop] instanceof Date))
                position.Task.dataList[index][position.tip.line[0].prop] = new Date(position.Task.dataList[index][position.tip.line[0].prop]);
            var lineWidth = 0;

            var lastSubStrIndex = 0;

            var canvasfillwidth = 0;

            var temp = true;
            // if (position.tip.line[i].prop == "APSMessage") {
            //     for (var j = 0; j < APSMessage.length; j++) {
            //         lineWidth += context.measureText(APSMessage[j]).width;
            //         if (lineWidth - canvasfillwidth > tipW) {
            //             if (temp) {
            //                 context.fillText(position.tip.line[i].text + ":" + APSMessage.substring(lastSubStrIndex, j), x + (tipW / 2), y + 8, tipW);//绘制截取部分
            //                 temp = false;
            //             }
            //             else
            //                 context.fillText("    " + APSMessage.substring(lastSubStrIndex, j), x + (tipW / 2), y + 8, tipW);//绘制截取部分
            //             y = y + lineH;
            //             lastSubStrIndex = j;
            //             canvasfillwidth = lineWidth;
            //         }
            //         if (j == APSMessage.length - 1) {//绘制剩余部分
            //             context.fillText("    " + APSMessage.substring(lastSubStrIndex, j + 1), x + (tipW / 2), y + 8, tipW);
            //             y = y + lineH;
            //         }

            //     }
            // }
            // else {
            var FORQIEDATA = position.Task.dataList[index][position.tip.line[i].prop];
               
            if(position.tip.line[i].prop == "TaskText")
            {
                for (var j = 0; j < FORQIEDATA.length; j++) {
                            lineWidth += context.measureText(FORQIEDATA[j]).width;
                            if (lineWidth - canvasfillwidth >= tipW-30) {
                                if (temp) {
                                    context.fillText(position.tip.line[i].text + ":" + FORQIEDATA.substring(lastSubStrIndex, j), x+10, y + 8, tipW);//绘制截取部分
                                    temp = false;
                                }
                                else
                                    context.fillText(FORQIEDATA.substring(lastSubStrIndex, j), x+10, y + 8, tipW);//绘制截取部分
                                y = y + lineH;
                                lastSubStrIndex = j;
                                canvasfillwidth = lineWidth;
                                COUNTS++;
                            }
                            if (j == FORQIEDATA.length - 1) {//绘制剩余部分
                                context.fillText(FORQIEDATA.substring(lastSubStrIndex, j + 1), x+10, y + 8, tipW);
                                y = y + lineH;
                                COUNTS++;
                            }
                        
                    }
                
            }
            else if(position.tip.line[i].prop == "APSMessage")
            {
                for (var j = 0; j < FORQIEDATA.length; j++) {
                            lineWidth += context.measureText(FORQIEDATA[j]).width;
                            if (lineWidth - canvasfillwidth >= tipW-30) {
                                if (temp) {
                                    context.fillText(position.tip.line[i].text + ":" + FORQIEDATA.substring(lastSubStrIndex, j), x+10, y + 8, tipW);//绘制截取部分
                                    temp = false;
                                }
                                else
                                    context.fillText(FORQIEDATA.substring(lastSubStrIndex, j), x+10, y + 8, tipW);//绘制截取部分
                                y = y + lineH;
                                lastSubStrIndex = j;
                                canvasfillwidth = lineWidth;
                                COUNTS++;
                            }
                            if (j == FORQIEDATA.length - 1) {//绘制剩余部分
                                context.fillText(FORQIEDATA.substring(lastSubStrIndex, j + 1), x+10, y + 8, tipW);
                                y = y + lineH;
                                COUNTS++;
                            }
                        
                    }
                
            }

            else{
                position.Task.dataList[index][position.tip.line[0].prop] = addDate(position.Task.dataList[index][position.tip.line[0].prop], 0);
                context.fillText(position.tip.line[i].text + ":" + position.Task.dataList[index][position.tip.line[i].prop],
                    x + 10, y + 8, tipW);//(tipW / 2)
                   
            }
                
            // }

            y = y + lineH;
            COUNTS++
        }

        context.font = "bold 15px Arial";
        context.fillStyle = 'black';
        context.textAlign = 'left';   //zace  左对齐
        context.globalAlpha = 0.2;
        context.fillRect(mousex, mousey, tipW+10, COUNTS*lineH+10);
        context.fillStyle = 'black';
        context.globalAlpha = 1;


    }

    // ResfushCanvas(position.Task.data);
    //context.fillStyle = 'white';
    //context.fillText('zzzzzzzzzzzzzzzzz',300,50);


    return {
        resfushCanvas: ResfushCanvas,
        install: install
    };
});


