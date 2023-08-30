require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'
], function ($zace, $com) {

    let MockData,
        MockInfo,
        HTML,
        CarList,
        AllCarList,
        TableMock,
        MockLight,
        mAreaID;
    /* 车辆台数mock数据对象
     */

    CarList = [
        {
            ID: 1,
            Name: "1#整体式地下架车机组",
            /* 是否开机 */
            IsActive: 1,
            /* 开机时间 */
            CreatTime: new Date(),
            /* 持续时间 */
            Time: 24 * 3600000,
            MockData: [
                {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "一号车厢",
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "二号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "三号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "四号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "五号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "六号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "七号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "八号车厢"
                }
            ],
            MockInfo: [
                {
                    /* 出库洗车灯 */
                    ID: 1,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 2,
                    /* Top 名称 */
                    NameTop: "1.2",
                    /* Bottom 名称 */
                    NameBottom: "1.1",
                },
                {
                    /* 出库洗车灯 */
                    ID: 2,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 2,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "2.2",
                    /* Bottom 名称 */
                    NameBottom: "2.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 3,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "3.2",
                    /* Bottom 名称 */
                    NameBottom: "3.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 4,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "4.2",
                    /* Bottom 名称 */
                    NameBottom: "4.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 5,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "5.2",
                    /* Bottom 名称 */
                    NameBottom: "5.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 6,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "6.2",
                    /* Bottom 名称 */
                    NameBottom: "6.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 7,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "7.2",
                    /* Bottom 名称 */
                    NameBottom: "7.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 8,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "8.2",
                    /* Bottom 名称 */
                    NameBottom: "8.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 9,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "9.2",
                    /* Bottom 名称 */
                    NameBottom: "9.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 10,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "10.2",
                    /* Bottom 名称 */
                    NameBottom: "10.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 11,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "11.2",
                    /* Bottom 名称 */
                    NameBottom: "11.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 12,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "12.2",
                    /* Bottom 名称 */
                    NameBottom: "12.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 13,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "13.2",
                    /* Bottom 名称 */
                    NameBottom: "13.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 14,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "14.2",
                    /* Bottom 名称 */
                    NameBottom: "14.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 15,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "15.2",
                    /* Bottom 名称 */
                    NameBottom: "15.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 16,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "16.2",
                    /* Bottom 名称 */
                    NameBottom: "16.1",
                }
            ]
        },
        {
            ID: 2,
            Name: "2#整体式底下架车机组",
            /* 是否开机 */
            IsActive: 2,
            /* 开机时间 */
            CreatTime: new Date(),
            /* 持续时间 */
            Time: 24 * 3600000,
            MockData: [
                {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "一号车厢",
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "二号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "三号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "四号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "五号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "六号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "七号车厢"
                }, {
                    /* ID */
                    ID: 1,
                    /* 车厢名称 */
                    Name: "八号车厢"
                }
            ],
            MockInfo: [
                {
                    /* 出库洗车灯 */
                    ID: 1,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 2,
                    /* Top 名称 */
                    NameTop: "1.2",
                    /* Bottom 名称 */
                    NameBottom: "1.1",
                },
                {
                    /* 出库洗车灯 */
                    ID: 2,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 2,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "2.2",
                    /* Bottom 名称 */
                    NameBottom: "2.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 3,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "3.2",
                    /* Bottom 名称 */
                    NameBottom: "3.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 4,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "4.2",
                    /* Bottom 名称 */
                    NameBottom: "4.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 5,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "5.2",
                    /* Bottom 名称 */
                    NameBottom: "5.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 6,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "6.2",
                    /* Bottom 名称 */
                    NameBottom: "6.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 7,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "7.2",
                    /* Bottom 名称 */
                    NameBottom: "7.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 8,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "8.2",
                    /* Bottom 名称 */
                    NameBottom: "8.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 9,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "9.2",
                    /* Bottom 名称 */
                    NameBottom: "9.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 10,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "10.2",
                    /* Bottom 名称 */
                    NameBottom: "10.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 11,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "11.2",
                    /* Bottom 名称 */
                    NameBottom: "11.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 12,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "12.2",
                    /* Bottom 名称 */
                    NameBottom: "12.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 13,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "13.2",
                    /* Bottom 名称 */
                    NameBottom: "13.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 14,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "14.2",
                    /* Bottom 名称 */
                    NameBottom: "14.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 15,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "15.2",
                    /* Bottom 名称 */
                    NameBottom: "15.1",
                }, {
                    /* 出库洗车灯 */
                    ID: 16,
                    /* Top 1代表正常 2代表异常 */
                    ActiveTop: 1,
                    /* Bottom 1代表正常 2代表异常 */
                    ActiveBottom: 1,
                    /* Top 名称 */
                    NameTop: "16.2",
                    /* Bottom 名称 */
                    NameBottom: "16.1",
                }
            ]
        }
    ];

    /* 表格数据 */
    TableMock = [
        {
            WID: 1,
            ID: 1,
            Code: "SB0001",
            Name: "1#整体式地下架车机组",
            Area: "临修线区",
            Team: "预检班组",
            Status: 1,
            Remark: "用于车体、转向架升降、分离；",
            OpenTime: "2021-03-25 14:48:38",
            SumTime: "20000小时",
            OpenRa: "25%",
        }
    ];

    /* 架车机列表mock数据对象 */
    AllCarList = [
        {
            ID: 1,
            /* 1代表正常 2代表异常 */
            Active: 1,
            /* 名称 */
            Name: "1#移动式架车机",
            /* 持续时间 */
            Time: 24 * 3600000,
            /* 开机时间 */
            CreatTime: new Date(),
            /* 车厢 */
            MockData: [
                {
                    ID: 1,
                    Name: "一号车"
                }, {
                    ID: 2,
                    Name: "二号车"
                }, {
                    ID: 3,
                    Name: "三号车"
                }, {
                    ID: 4,
                    Name: "四号车"
                }
            ]
        },
        {
            ID: 1,
            /* 1代表正常 2代表异常 */
            Active: 2,
            /* 名称 */
            Name: "2#移动式架车机",
            /* 持续时间 */
            Time: 24 * 3600000,
            /* 开机时间 */
            CreatTime: new Date(),
            /* 车厢 */
            MockData: [
                {
                    ID: 1,
                    Name: "一号车"
                }, {
                    ID: 2,
                    Name: "二号车"
                }, {
                    ID: 3,
                    Name: "三号车"
                }, {
                    ID: 4,
                    Name: "四号车"
                }
            ]
        }
    ];

    MockData = [
        {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "一号车厢",
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "二号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "三号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "四号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "五号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "六号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "七号车厢"
        }, {
            /* ID */
            ID: 1,
            /* 车厢名称 */
            Name: "八号车厢"
        }
    ];
    /* 车辆详情mock数据对象 */
    MockInfo = [
        {
            /* 出库洗车灯 */
            ID: 1,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 2,
            /* Top 名称 */
            NameTop: "1.2",
            /* Bottom 名称 */
            NameBottom: "1.1",
        },
        {
            /* 出库洗车灯 */
            ID: 2,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 2,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "2.2",
            /* Bottom 名称 */
            NameBottom: "2.1",
        }, {
            /* 出库洗车灯 */
            ID: 3,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "3.2",
            /* Bottom 名称 */
            NameBottom: "3.1",
        }, {
            /* 出库洗车灯 */
            ID: 4,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "4.2",
            /* Bottom 名称 */
            NameBottom: "4.1",
        }, {
            /* 出库洗车灯 */
            ID: 5,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "5.2",
            /* Bottom 名称 */
            NameBottom: "5.1",
        }, {
            /* 出库洗车灯 */
            ID: 6,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "6.2",
            /* Bottom 名称 */
            NameBottom: "6.1",
        }, {
            /* 出库洗车灯 */
            ID: 7,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "7.2",
            /* Bottom 名称 */
            NameBottom: "7.1",
        }, {
            /* 出库洗车灯 */
            ID: 8,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "8.2",
            /* Bottom 名称 */
            NameBottom: "8.1",
        }, {
            /* 出库洗车灯 */
            ID: 9,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "9.2",
            /* Bottom 名称 */
            NameBottom: "9.1",
        }, {
            /* 出库洗车灯 */
            ID: 10,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "10.2",
            /* Bottom 名称 */
            NameBottom: "10.1",
        }, {
            /* 出库洗车灯 */
            ID: 11,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "11.2",
            /* Bottom 名称 */
            NameBottom: "11.1",
        }, {
            /* 出库洗车灯 */
            ID: 12,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "12.2",
            /* Bottom 名称 */
            NameBottom: "12.1",
        }, {
            /* 出库洗车灯 */
            ID: 13,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "13.2",
            /* Bottom 名称 */
            NameBottom: "13.1",
        }, {
            /* 出库洗车灯 */
            ID: 14,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "14.2",
            /* Bottom 名称 */
            NameBottom: "14.1",
        }, {
            /* 出库洗车灯 */
            ID: 15,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "15.2",
            /* Bottom 名称 */
            NameBottom: "15.1",
        }, {
            /* 出库洗车灯 */
            ID: 16,
            /* Top 1代表正常 2代表异常 */
            ActiveTop: 1,
            /* Bottom 1代表正常 2代表异常 */
            ActiveBottom: 1,
            /* Top 名称 */
            NameTop: "16.2",
            /* Bottom 名称 */
            NameBottom: "16.1",
        }
    ];
    /* 光灯mock数据对象 */
    MockLight = [
        {
            /* 出库光灯 */
            ID: 1,
            /* 1代表绿色 2代表红色 */
            Active: 1
        },
        {
            /* 入库光灯 */
            ID: 2,
            /* 1代表绿色 2代表红色 */
            Active: 2
        }
    ];

    HTML = {
        /* 车辆顶部模板 */
        MetroContainTop: `
 
            <div class="app-top">
            <div class="app-top-mode flex-itemContain flex-column">
                <div>{{Name}}</div>
            </div>
            <div class="app-top-sed flex-itemContain flex-row">

                <div class="app-sed-switch flex-row">
                    <div class="">开机:</div>

                </div>
                <div class="app-sed-switch flex-row">
                    <figure class="circle app-float {{IsActiveCircle}}"></figure>

                </div>

            </div>
            <div class="app-top-sld flex-itemContain flex-row">

                <div class="app-sed-switch">
                    <div class="app-float">开机时间：</div>

                </div>
                <div class="app-sed-switch">
                    <div class="">{{CreatTime}}</div>

                </div>

            </div>
            <div class="app-top-fur flex-itemContain flex-row">

                <div class="app-sed-switch">
                    <div class="app-float">持续开机时长</div>

                </div>
                <div class="app-sed-switch">{{Time}}</div>
            </div>
            <div class="app-top-fiv flex-itemContain flex-row">
                <div class="app-sed-switch">
                   

                </div>
            </div>
        </div>
        <div class="MetroContain flex-row">
            {{MetroContainTem}}
        </div>
        <div class="CarriageContain flex-row">
            {{CarriageContainTem}}
        </div>
     
        `,
        /* 车模版 */
        MetroContainTem: `
        <div class="MetroInfoList">
        <!-- 车厢 -->
        <div class="MetroInfoBody flex-row">
         {{Name}}
        </div>
        <!-- 车轮 -->
        <div class="MetroInfoShoe app-float-left">
        <figure class="circle app-float-left"></figure>
        <figure class="circle app-float-left"></figure>
        </div>
        <div class="MetroInfoShoe app-float-right">
        <figure class="circle app-float-right"></figure>
        <figure class="circle app-float-right"></figure>
        </div>
        </div>`,
        /* 车详情 */
        CarriageContainTem: `
        <div class="CarriageContainInfo">
        <div class="CarriageContainInfoTop">
            <div class="CarriageContainInfoTopText">{{NameTop}}</div>
            <div class="CarriageContainInfoTopRect">
                <div class="CarriageContainInfoTopRectCenter {{ActiveTopClass}}">
                    <div class="Reacttop"></div>
                    <div class="Reactbottom"></div>
                </div>
            </div>
        </div>
        
        <div class="CarriageContainInfoBottom">
           
            <div class="CarriageContainInfoBottomRect">
                <div class="CarriageContainInfoTopRectCenter {{ActiveBottomClass}}">
                    <div class="Reacttop"></div>
                    <div class="Reactbottom"></div>
                </div>
            </div>
            <div class="CarriageContainInfoBottomText">
                {{NameBottom}}
            </div>
        </div>
        </div>`,
        /* 车详情 */
        OneCarTem: `
        <div class="OneCar">
        <div class="AllCarTop flex-column">
            <div class="AllCarTopInfo flex-row">
                <div class="app-top-mode flex-itemContain flex-row">
                    <div>{{Name}}</div>
                </div>
                <div class="app-top-sed flex-itemContain flex-row">

                    <div class="app-sed-switch">
                        <div class="">开机:</div>

                    </div>
                    <div class="app-sed-switch">
                        <figure class="circle app-float {{IsActiveCircle}}"></figure>

                    </div>
                </div>

                <div class="app-top-sed flex-itemContain flex-row">

                    <div class="btn-group" role="group">
                        <button type="button" class="btn lmvt-Active-btn">
                            <span class="glyphicon glyphicon-eye-close" aria-hidden="true">查看详情</span>
                        </button>
                    </div>

                </div>
            </div>
            <div class="AllCarTimeInfo flex-row">
                <div class="app-top-sed flex-itemContain flex-row">

                    <div class="app-sed-switch">
                        <div class="">开机时间:{{CreatTime}}</div>
                        <div></div>
                    </div>

                </div>
                <div class="app-top-sed flex-itemContain flex-row">

                    <div class="app-sed-switch">
                        <div class="">持续开机时长:{{Time}}</div>
                    </div>

                </div>
            </div>
        </div>
        <div class="AllCarBottom flex-row">
        {{AllCarBottom}}
        </div>
        </div>`,
        AllCarBottomTep: `
       
        <div class="CarContain flex-column">
            <div class="CarShoeTop flex-row">
                <div class="DoubleShoe flex-column">
                    <div class="ShoeReactTop"></div>
                    <div class="ShoeReactMiddle"></div>
                    <div class="ShoeReactBottom"></div>
                </div>
                <div class="DoubleShoe flex-column">
                    <div class="ShoeReactTop"></div>
                    <div class="ShoeReactMiddle"></div>
                    <div class="ShoeReactBottom"></div>
                </div>
            </div>
            <div class="CarBody flex-row">
                <div class="CarBodyContent flex-row">
                    {{Name}}
                </div>
            </div>
            <div class="CarShoeBottom flex-row">
                <div class="DoubleShoe flex-column">
                    <div class="ShoeReactBottom"></div>
                    <div class="ShoeReactMiddle"></div>
                    <div class="ShoeReactTop"></div>

                </div>
                <div class="DoubleShoe flex-column">
                    <div class="ShoeReactBottom"></div>
                    <div class="ShoeReactMiddle"></div>
                    <div class="ShoeReactTop"></div>
                </div>
            </div>
     
        </div>
        `,
        DeviceBody: [
            '<tr>',
            '<td data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" >{{ID}}</td>',
            '<td data-title="Code" data-value="{{Code}}" >{{Code}}</td>',
            '<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
            '<td data-title="Area" data-value="{{Area}}" >{{Area}}</td>',
            '<td data-title="Team" data-value="{{Team}}" >{{Team}}</td>',

            '<td data-title="IsCurrent" data-value="{{IsCurrent}}" ><span class="badge lmvt-badge {{IsUsedBadge}}">{{Badge}}</span>{{IsCurrent}}</td>',
            '<td data-title="Remark" data-value="{{Remark}}">{{Remark}}</td>',
            '<td data-title="OpenTime" data-value="{{OpenTime}}">{{OpenTime}}</td>',
            '<td data-title="SumTime" data-value="{{SumTime}}">{{SumTime}}</td>',
            '<td data-title="OpenRa" data-value="{{OpenRa}}">{{OpenRa}}</td>',

            '<td style="min-width: 80px;color:#C7001A" data-title="ID" data-value="{{ID}}"><div class="row">',
            '<div class="col-md-6 lmvt-do-info">详情</div>',
            '<div class="col-md-6 lmvt-do-info">查看日志</div>',
            '</td>',
            '</tr>',
        ].join(""),
    };

    model = $com.Model.create({

        el:"#contain",
        VueName:"contain",
        name: '临线区监视',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();

        },

        events: function () {
            $("body").delegate(".SrcDISplay", "click", function () {
                $this = $(this);
                window.open($this.attr("data-value"));
            })

        },

        run: function () {
            mAreaID =  Number(model.com.getCookie("AreaID"));
            /* 沉淀池 0.5个刻度是12px */
            model.com.getAreaDeviceState({AreaID:mAreaID,Active:1},function (res) {
                var wDevice ;
                res.list.forEach(function (item) {
                    if (item.DeviceType == 17){
                        model.com.getAreaDeviceState({item:ID,Active:1},function (resp) {
                            CarList = resp.list ;
                        })
                    }
                })
            })
            // $(".MetroContain").html($com.util.template(MockData, HTML.MetroContainTem));


            // $(".CarriageContain").html($com.util.template(MockInfo, HTML.CarriageContainTem));

            CarList.forEach(item => {

                item.IsActiveCircle = item.IsActive == 1 ? "Active" : "Forbidden";
                item.CreatTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreatTime);
                item.MockInfo.forEach(jtem => {
                    jtem.ActiveTopClass = jtem.ActiveTop == 1 ? "Active" : "Forbidden";
                    jtem.ActiveBottomClass = jtem.ActiveBottom == 1 ? "Active" : "Forbidden";
                });

                item.MetroContainTem = $com.util.template(item.MockData, HTML.MetroContainTem);
                item.CarriageContainTem = $com.util.template(item.MockInfo, HTML.CarriageContainTem);

            });

            $(".AllMetroComtain").html($com.util.template(CarList, HTML.MetroContainTop));

            AllCarList.forEach(item => {

                item.IsActiveCircle = item.Active == 1 ? "Active" : "Forbidden";
                item.CreatTime = $com.util.format("yyyy-MM-dd hh:mm:ss", item.CreatTime);
                item.MockData.forEach(jtem => {
                    jtem.ActiveTopClass = jtem.ActiveTop == 1 ? "Active" : "Forbidden";
                    jtem.ActiveBottomClass = jtem.ActiveBottom == 1 ? "Active" : "Forbidden";
                });

                item.AllCarBottom = $com.util.template(item.MockData, HTML.AllCarBottomTep);

            });

            $(".AllCar").html($com.util.template(AllCarList, HTML.OneCarTem));

            $(".lmvt-device-body").html($com.util.template(TableMock, HTML.DeviceBody));
        },


        com: {

            IsActive($this, Temp) {
                $this.find("figure").removeClass("circle-Active");
                $this.find("figure").removeClass("circle-forbidden");
                if (Temp == 1) {
                    $this.find("figure").addClass("circle-Active");
                } else {
                    $this.find("figure").addClass("circle-forbidden");
                }
            },
            //获取Cookie
            getCookie: function (c_name) {
                //判断document.cookie对象里面是否存有cookie
                if (document.cookie.length > 0) {
                    c_start = document.cookie.indexOf(c_name + "=")
                    //如果document.cookie对象里面有cookie则查找是否有指定的cookie，如果有则返回指定的cookie值，如果没有则返回空字符串
                    if (c_start != -1) {
                        c_start = c_start + c_name.length + 1
                        c_end = document.cookie.indexOf(";", c_start)
                        if (c_end == -1) c_end = document.cookie.length
                        return unescape(document.cookie.substring(c_start, c_end))
                    }
                }
                return ""
            },
            //获取当前区域设备的状态
            getAreaDeviceState: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceStatus/Current",
                    $TYPE: "Get",

                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },


        }
    }),

        model.init();


});