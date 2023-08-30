require([ '../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/cross2.js',
          '../static/utils/js/charf.js', '../static/utils/js/base/jquery.treeview', '../static/utils/js/pickPeopleWeb',
], function($zace, $com, $cross, $charf, $tree, $pick){

    let MockData,
        MockLamp,
        MockLight,
        mDeviceID;
    /* 水槽mock数据对象
     */
    MockData = [
        {
            /* 沉淀池数据对象 */
            ID: 1,
            /* 水位高度 */
            Height: 1.6,
        },
    ];
    /* 灯mock数据对象 */
    MockLamp = [
        {
            /* 出库洗车灯 */
            ID: 1,
            /* 1代表绿色 2代表红色 */
            Active: 1,
        },
        {
            /* 入库洗信号灯 */
            ID: 2,
            /* 1代表绿色 2代表红色 */
            Active: 2,
        },
    ];
    /* 光灯mock数据对象 */
    MockLight = [
        {
            /* 出库光灯 */
            ID: 1,
            /* 1代表绿色 2代表红色 */
            Active: 1,
        },
        {
            /* 入库光灯 */
            ID: 2,
            /* 1代表绿色 2代表红色 */
            Active: 2,
        },
    ];

    model = $com.Model.create({
        name: '洗车机',

        type: $com.Model.MAIN,

        configure: function(){
            this.run();
        },

        events: function(){
            window.setFunctionTrigger('MobileCarRackMachine', function(res){
                mDeviceID = res.ID;
                model.com.DeviceCurrentAll(mDeviceID);
            });
            $('body').delegate('.SrcDISplay', 'click', function(){
                $this = $(this);
                window.open($this.attr('data-value'));
            });
        },

        run: function(){
            mDeviceID = model.query.ID;
            /* 沉淀池 0.5个刻度是12px */

            // MockData.forEach(element => {
            //     if (element.ID == 1) {
            //         let height = element.Height * 24

            //         if (height >= 86) {
            //             height = 86;
            //         }

            //         $(".desilterReactWater").height(height);
            //     }
            // });
            // //出入库洗车灯
            // MockLamp.forEach(element => {
            //     switch (element.ID) {
            //         case 1:
            //             model.com.IsActive($(".circleOne"), element.Active); break
            //         case 2:
            //             model.com.IsActive($(".circleFour"), element.Active); break
            //     };

            // });
            // //出入库灯光
            // MockLight.forEach(element => {
            //     switch (element.ID) {
            //         case 1:
            //             model.com.IsActive($(".circleFive"), element.Active); break
            //         case 2:
            //             model.com.IsActive($(".circleSix"), element.Active); break
            //     };
            // });
            $('body').delegate('.general', 'click', function(){
                var vdata = {
                    'header': '通用界面',
                    'id': 'GeneralPage',
                    'href': `./process_control/GeneralPage.html?ID=${ mDeviceID }`,
                    'src': `./static/images/logpng/GeneralPage.png`,
                };
                window.parent.iframeHeaderSet(vdata);
                window.callFunctionTrigger('GeneralPage', mDeviceID);
            });
            model.com.DeviceCurrentAll(mDeviceID);
        },


        com: {
            // 渲染状态
            render(data){
                /**
                 * 切换Class
                 * @param isActive{Boolean} 是否激活
                 * @param dom{Element | Jquery | String} 需要调整class的节点
                 * @param activeClass{String} 激活时的class
                 * @param forbiddenClass{String} 禁用时的class
                 */
                function toggleClass(isActive, dom, activeClass, forbiddenClass){
                    $(dom).removeClass(isActive ? forbiddenClass : activeClass);
                    $(dom).addClass(!isActive ? forbiddenClass : activeClass);
                }

                // 切换激活状态
                [
                    // 自动
                    {
                        key: 'Auto',
                        dom: '.circle-AutoMatic',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },

                    // 洗涤液洗
                    {
                        key: 'WashingDetergent',
                        dom: '.circle-WashingDetergent',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },
                    // 手动
                    {
                        key: 'Manual',
                        dom: '.circle-Manual',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },
                    // 左端洗
                    {
                        key: 'UnprovokedWashing',
                        dom: '.circle-UnprovokedWashing',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },
                    // 右端洗
                    {
                        key: 'RightWash',
                        dom: '.circle-RightWash',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },
                    // 清水洗车
                    {
                        key: 'WashCar',
                        dom: '.circle-WashCar',
                        activeClass: 'circle-green',
                        forbiddenClass: 'circle',
                    },
                    // 洗车准备就绪
                    {
                        key: 'WashReady',
                        dom: '.circle-WashReady',
                        activeClass: 'circle-large-green',
                        forbiddenClass: 'circle-large',
                    },
                    // 洗车开始
                    {
                        key: 'WashStart',
                        dom: '.circle-WashStart',
                        activeClass: 'circle-large-green',
                        forbiddenClass: 'circle-large',
                    },
                    // 端洗开始
                    {
                        key: 'WashStart',
                        dom: '.circle-WashEnd',
                        activeClass: 'circle-large-green',
                        forbiddenClass: 'circle-large',
                    },
                    // 急停
                    {
                        key: 'EmergencyStop',
                        dom: '.circle-Stop',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 相序报警
                    {
                        key: 'PhaseAlarm',
                        dom: '.circle-PhaseAlarm',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 端洗报警
                    {
                        key: 'EndWashAlarm',
                        dom: '.circle-EndWashAlarm',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 水位报警1
                    {
                        key: 'WaterLevelAlarmOne',
                        dom: '.circle-WaterLevelAlarmOne',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 气压报警
                    {
                        key: 'PressureAlarm',
                        dom: '.circle-PressureAlarm',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 温度报警
                    {
                        key: 'TemperatureAlarm',
                        dom: '.circle-TemperatureAlarm',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },
                    // 水位报警2
                    {
                        key: 'WaterLevelAlarmTwo',
                        dom: '.circle-WaterLevelAlarmTwo',
                        activeClass: 'circle-large-red',
                        forbiddenClass: 'circle-large',
                    },

                    // 出库洗信号灯
                    {
                        key: 'ExitWashSignalLamp',
                        dom: '.circleOnefigure',
                        activeClass: 'circle-big-green',
                        forbiddenClass: 'circle-big',
                    },
                    // 后端洗信号灯
                    {
                        key: 'RearWashSignalLamp',
                        dom: '.circleTwofigure',
                        activeClass: 'circle-big-green',
                        forbiddenClass: 'circle-big',
                    },
                    // 前端洗信号灯
                    {
                        key: 'FrontEndSignalLamp',
                        dom: '.circleThreefigure',
                        activeClass: 'circle-big-green',
                        forbiddenClass: 'circle-big',
                    },
                    // 入库洗信号灯
                    {
                        key: 'InStorageWashingSignalLight',
                        dom: '.circleFourfigure',
                        activeClass: 'circle-big-green',
                        forbiddenClass: 'circle-big',
                    },
                    // 出库光灯
                    {
                        key: 'ExitLight',
                        dom: '.circleFivefigure',
                        activeClass: 'circle-min-green',
                        forbiddenClass: 'circle-min',
                    },
                    // 端洗光灯
                    {
                        key: 'EndWashLight',
                        dom: '.circleSixfigure',
                        activeClass: 'circle-min-green',
                        forbiddenClass: 'circle-min',
                    },
                    // 入库光灯
                    {
                        key: 'StorageLight',
                        dom: '.aaa',
                        circleSevenfigure: 'circle-min-green',
                        forbiddenClass: 'circle-min',
                    },


                ]
                    .forEach(function(item){
                        toggleClass(data[item.key], item.dom, item.activeClass, item.forbiddenClass);
                    });

                // 设定数值
                ( function(){
                    //洗车库温度
                    $('.WashCarTe').text(data.WashCarTe || 0);
                    //压缩气压力
                    $('.Pressure').text(data.CompressedGasPressure || 0);
                    //吃刷量
                    $('.BrushConsumption').text(data.BrushConsumption || 0);
                    //洗车时间
                    $('.WashCarTime').text(data.WashCarTime || 0);
                    //入库速度
                    $('.StorageSpeed').text(data.StorageSpeed || 0);
                } )();

                // 设定水位高度
                (function (){
                    /**
                     * 处理高度数据
                     * @param data{Number} 高度数据
                     * @param enlargement{Number} 放大倍率
                     * @param max{Number} 最大值
                     * @param defaultH{Number} 默认值
                     * @return {number|*}
                     */
                    function heightFilter(data, enlargement, max, defaultH){
                        return data ? Math.min(max, data * enlargement) : defaultH;
                    }

                    // 处理回水系高度 (统一为20,36,0)
                    function backWaterFilter(height){
                        return heightFilter(height, 24, 36, 0);
                    }

                    // 1#回水系
                    $('.backOneWater').height(backWaterFilter(data.BackOneWater));
                    // 2#会水系
                    $('.backTwoWater').height(backWaterFilter(data.BackTwoWater));
                    // 3#会水系
                    $('.backThreeWater').height(backWaterFilter(data.BackThreeWater));
                    // 4#会水系
                    $('.BackFourWater').height(backWaterFilter(data.BackFourWater));
                    // 5#会水系
                    $('.BackFiveWater').height(backWaterFilter(data.BackFiveWater));
                    // 热水泵
                    $('.BackSixWater').height(backWaterFilter(data.BackSixWater));
                    // 清水泵
                    $('.BackSevenWater').height(backWaterFilter(data.BackSevenWater));
                    // 软水泵
                    $('.BackEightWater').height(backWaterFilter(data.BackEightWater));

                    // 热水器
                    $('.waterHeaterWater').height(heightFilter(data.WaterHeater, 24, 86, 0));
                    // 沉淀池
                    $('.desilterReactWater').height(heightFilter(data.Desilter, 24, 86, 0));
                    // 光催化池
                    $('.industrialCatalysisWater').height(heightFilter(data.IndustrialCatalysis, 24, 86, 0));
                    // 回用水池
                    $('.backWaterReactWater').height(heightFilter(data.RecyclePoolLevel, 24, 86, 0));
                    // 清水池
                    $('.cleanWaterReactWater').height(heightFilter(data.ClearPoolLevel, 24, 86, 0));

                    // 集水池
                    ( function(){
                        var leftHeight = 0, rightHeight = 0;
                        if( data.SaveWater ){
                            var height = data.SaveWater * 24;
                            if( height <= 12 ){
                                leftHeight = height + 7;
                            } else if( height <= 86 ){
                                leftHeight = height + 7;
                                rightHeight = height - 12;
                            } else{
                                leftHeight = 108;
                                rightHeight = 86;
                            }
                        }
                        // 集水池 左
                        $('.saveWaterReactWater-left').height(leftHeight);
                        // 集水池 右
                        $('.saveWaterReactWater-right').height(rightHeight);
                    } )();
                })();
            },

            DeviceCurrentAll: function(mDeviceID){
                model.com.getDeviceCurrentAll({
                    DeviceID: mDeviceID,
                }, function(res){
                    model.com.render(res.info);
                    /*
                           //自动
                           if( res.info.Auto ){
                               $('.circle-AutoMatic').removeClass('circle');
                               $('.circle-AutoMatic').addClass('circle-green');
                           } else{
                               $('.circle-AutoMatic').removeClass('circle-green');
                               $('.circle-AutoMatic').addClass('circle');
                           }
                           //右端洗
                           if( res.info.RightWash ){
                               $('.circle-RightWash').removeClass('circle');
                               $('.circle-RightWash').addClass('circle-green');
                           } else{
                               $('.circle-RightWash').removeClass('circle-green');
                               $('.circle-RightWash').addClass('circle');
                           }
                           // 洗涤液洗
                           if( res.info.WashingDetergent ){
                               $('.circle-WashingDetergent').removeClass('circle');
                               $('.circle-WashingDetergent').addClass('circle-green');
                           } else{
                               $('.circle-WashingDetergent').removeClass('circle-green');
                               $('.circle-WashingDetergent').addClass('circle');
                           }
                           // 手动
                           if( res.info.Status6 ){
                               $('.circle-Manual').removeClass('circle');
                               $('.circle-Manual').addClass('circle-green');
                           } else{
                               $('.circle-Manual').removeClass('circle-green');
                               $('.circle-Manual').addClass('circle');
                           }
                           // 左端洗
                           if( res.info.UnprovokedWashing ){
                               $('.circle-UnprovokedWashing').removeClass('circle');
                               $('.circle-UnprovokedWashing').addClass('circle-green');
                           } else{
                               $('.circle-UnprovokedWashing').removeClass('circle-green');
                               $('.circle-UnprovokedWashing').addClass('circle');
                           }
                           // 清水洗车
                           if( res.info.WashCar ){
                               $('.circle-WashCar').removeClass('circle');
                               $('.circle-WashCar').addClass('circle-green');
                           } else{
                               $('.circle-WashCar').removeClass('circle-green');
                               $('.circle-WashCar').addClass('circle');
                           }


                           // 洗车准备就绪
                           if( res.info.WashReady ){
                               $('.circle-WashReady').removeClass('circle-large');
                               $('.circle-WashReady').addClass('circle-large-green');
                           } else{
                               $('.circle-WashReady').removeClass('circle-large-green');
                               $('.circle-WashReady').addClass('circle-large');
                           }

                           // 洗车开始
                           if( res.info.WashStart ){
                               $('.circle-WashStart').removeClass('circle-large');
                               $('.circle-WashStart').addClass('circle-large-green');
                           } else{
                               $('.circle-WashStart').removeClass('circle-large-green');
                               $('.circle-WashStart').addClass('circle-large');
                           }
                           // 端洗开始
                           if( res.info.WashStart ){
                               $('.circle-WashEnd').removeClass('circle-large');
                               $('.circle-WashEnd').addClass('circle-large-green');
                           } else{
                               $('.circle-WashEnd').removeClass('circle-large-green');
                               $('.circle-WashEnd').addClass('circle-large');
                           }

                           // 急停
                           if( res.info.Status4 ){
                               $('.circle-Stop').removeClass('circle-large');
                               $('.circle-Stop').addClass('circle-large-red');
                           } else{
                               $('.circle-Stop').removeClass('circle-large-red');
                               $('.circle-Stop').addClass('circle-large');
                           }

                           // 相序报警
                           if( res.info.PhaseAlarm ){
                               $('.circle-PhaseAlarm').removeClass('circle-large');
                               $('.circle-PhaseAlarm').addClass('circle-large-red');
                           } else{
                               $('.circle-PhaseAlarm').removeClass('circle-large-red');
                               $('.circle-PhaseAlarm').addClass('circle-large');
                           }
                           // 端洗报警
                           if( res.info.EndWashAlarm ){
                               $('.circle-EndWashAlarm').removeClass('circle-large');
                               $('.circle-EndWashAlarm').addClass('circle-large-red');
                           } else{
                               $('.circle-EndWashAlarm').removeClass('circle-large-red');
                               $('.circle-EndWashAlarm').addClass('circle-large');
                           }

                           // 水位报警1
                           if( res.info.WaterLevelAlarmOne ){
                               $('.circle-WaterLevelAlarmOne').removeClass('circle-large');
                               $('.circle-WaterLevelAlarmOne').addClass('circle-large-red');
                           } else{
                               $('.circle-WaterLevelAlarmOne').removeClass('circle-large-red');
                               $('.circle-WaterLevelAlarmOne').addClass('circle-large');
                           }


                           // 气压报警
                           if( res.info.PressureAlarm ){
                               $('.circle-PressureAlarm').removeClass('circle-large');
                               $('.circle-PressureAlarm').addClass('circle-large-red');
                           } else{
                               $('.circle-PressureAlarm').removeClass('circle-large-red');
                               $('.circle-PressureAlarm').addClass('circle-large');
                           }

                           // 温度报警
                           if( res.info.TemperatureAlarm ){
                               $('.circle-TemperatureAlarm').removeClass('circle-large');
                               $('.circle-TemperatureAlarm').addClass('circle-large-red');
                           } else{
                               $('.circle-TemperatureAlarm').removeClass('circle-large-red');
                               $('.circle-TemperatureAlarm').addClass('circle-large');
                           }
                           // 水位报警2
                           if( res.info.WaterLevelAlarmTwo ){
                               $('.circle-WaterLevelAlarmTwo').removeClass('circle-large');
                               $('.circle-WaterLevelAlarmTwo').addClass('circle-large-red');
                           } else{
                               $('.circle-WaterLevelAlarmTwo').removeClass('circle-large-red');
                               $('.circle-WaterLevelAlarmTwo').addClass('circle-large');
                           }
                           */
                    /*
                   //回水系1
                    if( res.info.BackOneWater ){
                        var height = res.info.BackOneWater * 24;
                        if( height >= 36 ) height = 36;
                        $('.backOneWater').height(height);
                    } else{
                        $('.backOneWater').height(0);
                    }
                    //回水系2
                    if( res.info.BackTwoWater ){
                        var height = res.info.BackTwoWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backTwoWater').height(height);
                    } else{
                        $('.backTwoWater').height(0);
                    }
                    //回水系3
                    if( res.info.BackThreeWater ){
                        var height = res.info.BackThreeWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backThreeWater').height(height);
                    } else{
                        $('.backThreeWater').height(0);
                    }
                    //回水系4
                    if( res.info.BackFourWater ){
                        var height = res.info.BackFourWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backFourWater').height(height);
                    } else{
                        $('.backFourWater').height(0);
                    }
                    //回水系5
                    if( res.info.BackFiveWater ){
                        var height = res.info.BackFiveWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backFiveWater').height(height);
                    } else{
                        $('.backFiveWater').height(0);
                    }
                    //回水系6
                    if( res.info.BackSixWater ){
                        var height = res.info.BackSixWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backSixWater').height(height);
                    } else{
                        $('.backSixWater').height(0);
                    }
                    //回水系7
                    if( res.info.BackSevenWater ){
                        var height = res.info.BackSevenWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backSevenWater').height(height);
                    } else{
                        $('.backSevenWater').height(0);
                    }
                    //回水系8
                    if( res.info.BackEightWater ){
                        var height = res.info.BackEightWater * 24;
                        if( height >= 36 ){
                            height = 36;
                        }
                        $('.backEightWater').height(height);
                    } else{
                        $('.backEightWater').height(0);
                    }
                    */
                    /*
                       //集水池
                    if( res.info.SaveWater ){
                        var height = res.info.SaveWater * 24;
                        if( height >= 93 ){
                            height = 93;
                        }
                        if( height <= 12 ){
                            // 集水池 左
                            $('.saveWaterReactWater-left').height(height + 7);
                            //集水池  右
                            $('.saveWaterReactWater-right').height(0);
                        } else if( height > 12 && height <= 86 ){
                            // 集水池 左
                            $('.saveWaterReactWater-left').height(height + 7);
                            //集水池  右
                            $('.saveWaterReactWater-right').height(height - 12);
                        } else{
                            // 集水池 左
                            $('.saveWaterReactWater-left').height(105);
                            //集水池  右
                            $('.saveWaterReactWater-right').height(86);
                        }
                    } else{
                        // 集水池 左
                        $('.saveWaterReactWater-left').height(0);
                        //集水池  右
                        $('.saveWaterReactWater-right').height(0);
                    }*/
                    /*
                    //热水器
                    if( res.info.WaterHeater ){
                        var height = res.info.WaterHeater * 24;
                        if( height >= 86 ){
                            height = 86;
                        }
                        $('.waterHeaterWater').height(height);
                    } else{
                        $('.waterHeaterWater').height(0);
                    }
                    //沉淀池
                    if( res.info.Desilter ){
                        var height = res.info.Desilter * 24;
                        if( height >= 86 ){
                            height = 86;
                        }
                        $('.desilterReactWater').height(height);
                    } else{
                        $('.desilterReactWater').height(0);
                    }
                    //光催化池
                    if( res.info.IndustrialCatalysis ){
                        var height = res.info.IndustrialCatalysis * 24;
                        if( height >= 86 ){
                            height = 86;
                        }
                        $('.industrialCatalysisWater').height(height);
                    } else{
                        $('.industrialCatalysisWater').height(0);
                    }
                    //回用水池
                    if( res.info.RecyclePoolLevel ){
                        var height = res.info.RecyclePoolLevel * 24;
                        if( height >= 86 ){
                            height = 86;
                        }
                        $('.backWaterReactWater').height(height);
                    } else{
                        $('.backWaterReactWater').height(0);
                    }
                    //清水池
                    if( res.info.ClearPoolLevel ){
                        var height = res.info.ClearPoolLevel * 24;
                        if( height >= 86 ){
                            height = 86;
                        }
                        $('.cleanWaterReactWater').height(height);
                    } else{
                        $('.cleanWaterReactWater').height(0);
                    }
                    */
                    /*
                    //出库洗信号灯
                    if( res.info.ExitWashSignalLamp ){
                        $('.circleOnefigure').removeClass('circle-big');
                        $('.circleOnefigure').addClass('circle-big-green');
                    } else{
                        $('.circleOnefigure').removeClass('circle-big-green');
                        $('.circleOnefigure').addClass('circle-big');
                    }

                    //后端洗信号灯
                    if( res.info.RearWashSignalLamp ){
                        $('.circleTwofigure').removeClass('circle-big');
                        $('.circleTwofigure').addClass('circle-big-green');
                    } else{
                        $('.circleTwofigure').removeClass('circle-big-green');
                        $('.circleTwofigure').addClass('circle-big');
                    }
                    //前端洗信号灯
                    if( res.info.FrontEndSignalLamp ){
                        $('.circleThreefigure').removeClass('circle-big');
                        $('.circleThreefigure').addClass('circle-big-green');
                    } else{
                        $('.circleThreefigure').removeClass('circle-big-green');
                        $('.circleThreefigure').addClass('circle-big');
                    }

                    //入库洗信号灯
                    if( res.info.InStorageWashingSignalLight ){
                        $('.circleFourfigure').removeClass('circle-big');
                        $('.circleFourfigure').addClass('circle-big-green');
                    } else{
                        $('.circleFourfigure').removeClass('circle-big-green');
                        $('.circleFourfigure').addClass('circle-big');
                    }
                    //出库光灯
                    if( res.info.ExitLight ){
                        $('.circleFivefigure').removeClass('circle-min');
                        $('.circleFivefigure').addClass('circle-min-green');
                    } else{
                        $('.circleFivefigure').removeClass('circle-min-green');
                        $('.circleFivefigure').addClass('circle-min');
                    }
                    //端洗光灯
                    if( res.info.EndWashLight ){
                        $('.circleSixfigure').removeClass('circle-min');
                        $('.circleSixfigure').addClass('circle-min-green');
                    } else{
                        $('.circleSixfigure').removeClass('circle-min-green');
                        $('.circleSixfigure').addClass('circle-min');
                    }
                    //入库光灯
                    if( res.info.StorageLight ){
                        $('.circleSevenfigure').removeClass('circle-min');
                        $('.circleSevenfigure').addClass('circle-min-green');
                    } else{
                        $('.circleSevenfigure').removeClass('circle-min-green');
                        $('.circleSevenfigure').addClass('circle-min');
                    }
                    */
                });

                setTimeout(function(){
                    model.com.DeviceCurrentAll(mDeviceID);
                }, 10000);

            },

            IsActive($this, Temp){
                $this.find('figure').removeClass('circle-Active');
                $this.find('figure').removeClass('circle-forbidden');
                if( Temp == 1 ){
                    $this.find('figure').addClass('circle-Active');
                } else{
                    $this.find('figure').addClass('circle-forbidden');
                }
            },

            //获取单条设备各种参数
            getDeviceCurrentAll: function(data, fn, context){
                var d = {
                    $URI: '/DMSDeviceRealParameter/DeviceCurrentAll',
                    $TYPE: 'Get',

                };

                function err(){
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    }),

        model.init();


});
