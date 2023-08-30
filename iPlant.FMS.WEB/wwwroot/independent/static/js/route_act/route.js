require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/route_new', '../static/utils/js/base/tooltip'], function ($yang, $com, $route, $tooltip) {

    var HTML,
        model,
        PropertyField,
        KEYWORD,
        KEYWORD_PROPERTY,
        KEYWORD_LIST,
        KEYWORD_LIST_PROPERTY,
        DEFAULT_VALUE,
        DEFAULT_VALUE_PROPERTY,
        TypeSource,
        TypeSource_PROPERTY,
        FORMATTRT,
        FORMATTRT_PROPERTY,
        DMSDeviceSource,
        DMSDevicePropertySource,
        TypeSource_Point,
        DATA,
        DATA1,
        DATA2,
        Index,
        Formattrt_Arrange,
        RanderData1,
        DataAll,
        DataAllTrue,
        DataAll2,
        DataType,
        AllUser,
        Allsu,
        AllSpareSu,
        AllType,
        Allspare,
        mID,
        parms,
        TIME;
    AllUser = [];
    Index = 0;
    TIME = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
    Formattrt_Arrange = [];

    HTML = {
        test: [
          '<tr>',
          '<td style="width: 3px"><input type="checkbox"',
          'class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td> ',
          '<td style="min-width: 50px" data-title="ID" data-value="{{ID}}">{{ID}}</td> ',
          '<td style="min-width: 50px" data-title="KKK " data-value="{{KKK }}">{{KKK }}</td>  ',
          '<td style="min-width: 50px" data-title="PrevID" data-value="{{PrevID}}">{{PrevID}}</td>  ',
          '<td style="min-width: 50px" data-title="NextIDListName" data-value="{NextIDListName}}">{{NextIDListName}}</td>  ',
          '<td style="min-width: 50px" data-title="OrderID" data-value="{OrderID}}">{{OrderID}}</td>  ',
          '<td style="min-width: 50px" data-title="Type" data-value="{Type}}">{{Type}}</td>  ',
          '<td style="min-width: 50px" data-title="abc" data-value="{abc}}">{{abc}}</td>  ',
          '</tr>',
        ].join(""),
    };

    (function () {
        KETWROD_LIST_Arrange = [
            "Type|形状|ArrayOne",
            "PrevID|上级名称|ArrayOne",
        ];
        KETWROD_Template_Arrange = {};

        Formattrt_Arrange = {};

        TypeSource_Arrange = {
            Type: [
                   {
                       name: "矩形",
                       value: 1
                   },
                 {
                     name: "椭圆形",
                     value: 2
                 },
                  {
                      name: "菱形",
                      value: 3
                  },
            ],
            PrevID: [],
            
        };
        $.each(KETWROD_LIST_Arrange, function (i, item) {
            var detail = item.split("|");
            KETWROD_Template_Arrange[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };

            if (detail.length > 2) {
                Formattrt_Arrange[detail[0]] = $com.util.getFormatter(TypeSource_Arrange, detail[0], detail[2]);
            }
        });
    })();
    (function () {
        KEYWORD_Point_LIST = [
          "KKK|名称|",
          "OrderID|层级|ArrayOneControl",
          "PrevID|上级|ArrayOneControl|OrderID",
          "NextIDList|条线集合|Array",
          "abc|流程框颜色|",
          "Type|流程框类型|ArrayOne",
        ];
      
        FORMATTRT = {};
        KEYWORD = {};
        DEFAULT_VALUE = {

            ID: 0,
            SpareNo: "",
            AssetID: 0,
            SpareModelID: 0,
            SpareLife: 0,
            ScrapValue: 0,
            NetValue: 0,
            LimitCount: 0,
            Status: 0,
            OperatorID: 0,
            OperatorTime: TIME,
        };
        TypeSource_Point = {
            OrderID: [],
            PrevID: [
             {
                 name: "无",
                 value: 100
             }, ],
            Type: [
                {name:"矩形",
                 value:1
                },
                 {
                     name: "椭圆形",
                     value: 2
                 },
                  {
                      name: "菱形",
                      value: 3
                  },
            ],
            NextIDList:[

        ]
            
        };
        $.each(KEYWORD_Point_LIST, function (i, item) {
            var detail = item.split("|");
            KEYWORD[detail[0]] = {
                index: i,
                name: detail[1],
                type: detail.length > 2 ? detail[2] : undefined,
                control: detail.length > 3 ? detail[3] : undefined
            };
            if (detail.length > 2) {
                FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource_Point, detail[0], detail[2]);
            }
        });
    })();

    model = $com.Model.create({
        name: '流程图演示',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            //隐藏grid
            $("body").delegate("#tzj-hide", "click", function () {
                $(".iplant-tool-center").css("margin-right", "0");
                $(".iplant-tool-right").hide();
                if (Index != 3 && Index != 4)
                    Index = 1;
                else
                    Index = 4;
            });
            //打开流程图
            $("body").delegate("#tzj-hide2", "click", function () {
                $("#tzj-routeTable").hide();
                $("#tzj-routeImg").show();
            });
            //隐藏
            $("body").delegate("#tzj-hide1", "click", function () {
                $("#tzj-routeTable").show();
                $("#tzj-routeImg").hide();
                $(".iplant-tool-right").hide();
                $(".iplant-tool-center").css("margin-right", "0");
                if (Index == 1 || Index == 2)
                    Index = 1;
                else
                    Index = 4;
            });
            //保存
            $("body").delegate("#tzj-sava", "click", function () {
                var _data = $com.propertyGrid.getData($(".grid_center"));
                var _list = [];
                for (var i = 0; i < _data.data.NextIDList.length; i++) {
                    _list.push(parseInt(_data.data.NextIDList[i]));
                }
                _data.data.NextIDList = _list;
                for (var i = 0; i < parms.data.length; i++) {
                    if (parms.data[i].ID == mID) {
                        parms.data[i].NextIDList = _data.data.NextIDList;
                        parms.data[i].KKK = _data.data.KKK;
                        parms.data[i].Type = parseInt(_data.data.Type);
                        parms.data[i].abc = _data.data.abc;
                    }
                }
              var _checkData=  model.com.getOrder(parms.data, mID, _data.data.OrderID, _data.data.PrevID);
                $("#test").remove();
                var _temp = " <div id='test' style='margin:0 auto;width:800px'></div> ";
                $("#grid").append(_temp);
                $route.show($("#test"), parms);
                Index = 3;
                 model.com.refresh();
            });
        },

        run: function () {
            model.com.start();
            model.com.refresh();

        },
        com: {
            //给数据正确的排序
            //OrderID:改变后的orderID
            //PrevID：改变后的prevID
            getOrder: function (data, ID, OrderID, PrevID) {
                var _returnlist=[];
                //第一步：获取当前id相关的所有数据（只包含主线）
                var _sonlist = model.com.iteration(data, ID, []);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == ID) {
                        _sonlist.splice(0, 0, data[i]);
                    }
                }
                
                //第二步：获取上级id的相关数据（只包含主线）
                var _farlist =model.com.iteration(data, PrevID, []);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == PrevID) {
                        _farlist.splice(0, 0, data[i]);
                    }
                }
                //第三步：获取其他数据的
                var _ortherlist = [];
                var _data = $com.util.Clone(data);
                //删除目标相关数据
                for (var i = 0; i < _data.length; i++) {
                    for (var j = 0; j < _sonlist.length; j++) {
                        if (_data[i].ID == _sonlist[j].ID) {
                            _data.splice(i, 1);
                        }
                    }
                }
                //删除上级相关数据
                for (var i = 0; i < _data.length; i++) {
                    for (var j = 0; j < _farlist.length; j++) {
                        if (_data[i].ID == _farlist[j].ID) {
                            _data.splice(i, 1);
                        }
                    }
                }
                _ortherlist = _data;
                
                //第四步 改变当前id相关数据的orderID
                var orderSpace = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == ID) {
                         orderSpace = OrderID - data[i].OrderID;
                   }
                }
                for (var i = 0; i < _sonlist.length; i++) {
                    data[i].OrderID += orderSpace;
                }
                //第五步  处理数据先后问题
                //求出最大层级
                var maxOrder=model.com.getMaxOrder(_sonlist,_farlist,_ortherlist);
                for (var i = 1; i <=maxOrder; i++) {
                    //先父级相关数据的底层级
                    for (var j = 0; j < _farlist.length; j++) {
                        if (_farlist[j].OrderID == i) {
                            _returnlist.push(_farlist[j]);
                        }
                    }
                    //再装子级相关数据的底层级
                    for (var j = 0; j < _sonlist.length; j++) {
                        if (_sonlist[j].OrderID == i) {
                            _returnlist.push(_sonlist[j]);
                        }
                    }
                    //再装其他数据的底层级
                    for (var j = 0; j < _ortherlist.length; j++) {
                        if (_ortherlist[j].OrderID == i) {
                            _returnlist.push(_ortherlist[j]);
                        }
                    }
                }
                return _returnlist;
            },
            //迭代找子级
            iteration: function (data, target, list) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PrevID == target) {
                        list.push(data[i]);
                        model.com.iteration(data, list[list.length-1].ID,list);
                    }
                }
                return list;
            },
            getMaxOrder: function (list1, list2, list3) {
                var _max = 0;
                for (var i = 0; i < list1.length; i++) {
                    if (list1[i].OrderID > _max) {
                        _max = list1[i].OrderID;
                    }
                }
                for (var i = 0; i < list2.length; i++) {
                    if (list2[i].OrderID > _max) {
                        _max = list2[i].OrderID;
                    }
                }
                for (var i = 0; i < list3.length; i++) {
                    if (list3[i].OrderID > _max) {
                        _max = list3[i].OrderID;
                    }
                }
                return _max;
            },
            refresh:function(){
                var list = parms.data;
                list = $com.util.Clone(list);
                for (var i = 0; i < list.length; i++) {
                    var str = "";
                    for (var j = 0; j < list[i].NextIDList.length; j++) {
                      str += list[i].NextIDList[j] + " ;";
                    }
                    list[i].NextIDListName = str;
                }
                $.each(list, function (i, item) {
                    for (var p in item) {
                        if (!Formattrt_Arrange[p])
                            continue;
                        item[p] = Formattrt_Arrange[p](item[p]);
                    }
                });
                $(".lmvt-device-body").html($com.util.template(list, HTML.test));
            },
            changeData: function (data) {
                var obj = {
                    ID: ":" + data.ID,
                    名称: ":" + data.KKK,
                }
                return obj;
            },
            start: function () {
                var mouseoverFn = function (data, json) {
                    //if (i == 1) {
                        var $target = {
                            offset: function () {
                                if (Index == 1) {
                                    return {
                                        left: json.X + json.left+350+60,
                                        top: json.Y + json.top +30,
                                    };
                                } else if (Index == 2) {
                                    return {
                                        left: json.X + json.left+200,
                                        top: json.Y + json.top+30,
                                    };
                                } else if (Index == 3) {
                                    return {
                                        left: json.X + json.left -60,
                                        top: json.Y + json.top - 30,
                                    };
                                } else if (Index == 4) {
                                    return {
                                        left: json.X + json.left + 150,
                                        top: json.Y + json.top-30 ,
                                    };
                                }
                            },
                            width: function () {
                                return json.width;
                            },
                            height: function () {
                                return json.height;
                            },
                        }
                    
                    var dataHtml = model.com.changeData(data);
                    $tooltip.show({ target: $target, object: dataHtml, orientation: 2, Choice_color: 4, max_width: 200, fontsize: 12 });
                }
                var mouseoutFn = function (data) {
                    $tooltip.clear();
                }
                //点击方法
                var clickFn = function (data, json) {
                    $(".iplant-tool-center").css("margin-right", "400px");
                    $(".iplant-tool-right").css("width", "400px");
                    $(".iplant-tool-right").show();
                    mID = data.ID;
                    $com.propertyGrid.show($(".grid_center"), data, KEYWORD, TypeSource_Point);
                    if (Index != 3 && Index != 4) {
                        Index = 2;
                    } else
                        Index = 3;
                }
                parms = {
                    data: [ //数据源  
                        {
                            "KKK": "流程一", //显示字段名称
                            "ID": 1, //索引字段名称
                            "PrevID": 0, //上级字段名称
                            "NextIDList": [], //下级字段名称
                            "OrderID": 1, //第几层
                            "Type": 1,
                            "abc": "Pink", //背景色字段名称
                            "bcd": "white", //前景色字段名称
                        },
                          {
                              "KKK": "流程六", //显示字段名称
                              "ID": 6, //索引字段名称
                              "PrevID": 0, //上级字段名称
                              "NextIDList": [], //下级字段名称
                              "OrderID": 1, //第几层
                              "Type": 2,
                              "abc": "Pink", //背景色字段名称
                              "bcd": "white", //前景色字段名称
                          },
                            {
                                "KKK": "流程7", //显示字段名称
                                "ID": 7, //索引字段名称
                                "PrevID": 0, //上级字段名称
                                "NextIDList": [], //下级字段名称11,8
                                "OrderID": 1, //第几层
                                "Type": 2,
                                "abc": "Pink", //背景色字段名称
                                "bcd": "white", //前景色字段名称
                            },
                       {
                           "KKK": "流程二", //显示字段名称
                           "ID": 2, //索引字段名称
                           "PrevID": 1, //上级字段名称
                           "NextIDList": [], //下级字段名称
                           "OrderID": 2, //第几层
                           "Type": 1,
                           "abc": "Pink", //背景色字段名称
                           "bcd": "white", //前景色字段名称
                       },
                       {
                           "KKK": "流程三", //显示字段名称
                           "ID": 3, //索引字段名称
                           "PrevID": 1, //上级字段名称
                           "NextIDList": [], //下级字段名称
                           "OrderID": 2, //第几层
                           "Type": 1,
                           "abc": "Pink", //背景色字段名称
                           "bcd": "white", //前景色字段名称
                       },
                         {
                             "KKK": "流程十", //显示字段名称
                             "ID": 10, //索引字段名称
                             "PrevID": 6, //上级字段名称
                             "NextIDList": [], //下级字段名称
                             "OrderID": 2, //第几层
                             "Type": 1,
                             "abc": "Pink", //背景色字段名称
                             "bcd": "white", //前景色字段名称
                         },

                          //{
                          //    "KKK": "流程十三", //显示字段名称
                          //    "ID": 13, //索引字段名称
                          //    "PrevID": 0, //上级字段名称
                          //    "NextIDList": [11], //下级字段名称
                          //    "OrderID": 2, //第几层
                          //    "Type": 2,
                          //    "abc": "Pink", //背景色字段名称
                          //    "bcd": "white", //前景色字段名称
                          //},
                         {
                             "KKK": "流程四", //显示字段名称
                             "ID": 4, //索引字段名称
                             "PrevID": 2, //上级字段名称
                             "NextIDList": [], //下级字段名称
                             "OrderID": 3, //第几层
                             "Type": 2,
                             "abc": "Pink", //背景色字段名称
                             "bcd": "white", //前景色字段名称
                         },
                          {
                              "KKK": "流程八", //显示字段名称
                              "ID": 8, //索引字段名称
                              "PrevID": 3, //上级字段名称
                              "NextIDList": [], //下级字段名称
                              "OrderID": 3, //第几层
                              "Type": 3,
                              "abc": "Pink", //背景色字段名称
                              "bcd": "white", //前景色字段名称
                          },
                            {
                                "KKK": "流程十一", //显示字段名称
                                "ID": 11, //索引字段名称
                                "PrevID": 10, //上级字段名称
                                "NextIDList": [], //下级字段名称
                                "OrderID": 3, //第几层
                                "Type": 1,
                                "abc": "Pink", //背景色字段名称
                                "bcd": "white", //前景色字段名称
                            },
                            {
                                "KKK": "流程十四", //显示字段名称
                                "ID": 14, //索引字段名称
                                "PrevID": 0, //上级字段名称
                                "NextIDList": [], //下级字段名称
                                "OrderID": 3, //第几层
                                "Type": 2,
                                "abc": "Pink", //背景色字段名称
                                "bcd": "white", //前景色字段名称
                            },
                      {
                          "KKK": "流程五", //显示字段名称
                          "ID": 5, //索引字段名称
                          "PrevID": 4, //上级字段名称
                          "NextIDList": [], //下级字段名称
                          "OrderID": 4, //第几层
                          "Type": 1,
                          "abc": "Pink", //背景色字段名称
                          "bcd": "white", //前景色字段名称
                      },
                      {
                          "KKK": "流程九", //显示字段名称
                          "ID": 9, //索引字段名称
                          "PrevID": 8, //上级字段名称
                          "NextIDList": [], //下级字段名称
                          "OrderID": 4, //第几层
                          "Type": 2,
                          "abc": "Pink", //背景色字段名称
                          "bcd": "white", //前景色字段名称
                      },
                         {
                             "KKK": "流程十二", //显示字段名称
                             "ID": 12, //索引字段名称
                             "PrevID": 11, //上级字段名称
                             "NextIDList": [], //下级字段名称8,4
                             "OrderID": 4, //第几层
                             "Type": 2,
                             "abc": "Pink", //背景色字段名称
                             "bcd": "white", //前景色字段名称
                         },
                    ],
                    dataSet: {//对应关系
                        "Text": "KKK", //显示字段名称
                        "Index": "ID", //索引字段名称
                        "PrevIndex": "PrevID", //上级字段名称
                        "NextIndex": "NextID", //下级字段名称
                        "FatherID": "FatherID",  //父级ID
                        "BGC": "abc", //背景色字段名称
                        "FGC": "bcd", //前景色字段名称
                    },

                    background_color: 'transparent', //流程框背景颜色
                    foreground_color: 'red', //箭头颜色 
                    fn_mouseover: mouseoverFn, //鼠标悬停触发
                    fn_mouseout: mouseoutFn, //鼠标移走事件
                    fn_click: clickFn, //鼠标单击
                    constant: {}
                };
                var obj={};
                for (var i = 0; i < parms.data.length; i++) {
                    TypeSource_Arrange.PrevID.push({ name: parms.data[i].KKK, value: parms.data[i].ID });
                   
                    if (!obj[parms.data[i].OrderID]) {
                        TypeSource_Point.OrderID.push({ name: parms.data[i].OrderID, value: parms.data[i].OrderID,far:100});
                        obj[parms.data[i].OrderID] = true;
                    }
                    var _farID = parms.data[i].OrderID + 1;
                    TypeSource_Point.PrevID.push({ name: parms.data[i].KKK, value: parms.data[i].ID, far: _farID });
                    TypeSource_Point.NextIDList.push({ name: parms.data[i].KKK, value: parms.data[i].ID });
                }
                $route.show($("#test"), parms);
                Index++;
            }
            
        }
    });

    model.init();


});