require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'
], function ($zace, $com) {

    let MockData,
        MockInfo,
        HTML,
        CarList,
        AllCarList,
        TableMock,
        MockLight,
        mDevice;
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
        }
    ];

    /* 表格数据 */
    TableMock = [
        {
            1: "lmvt-activeBadge",
            2: "lmvt-activeBadge",
            3: "lmvt-activeBadge",
            4: "lmvt-defBadge",
            5: "lmvt-defBadge",
            6: "lmvt-activeBadge",
            7: "lmvt-defBadge",
            8: "lmvt-defBadge",
            9: "lmvt-activeBadge",
            10: "lmvt-defBadge",
            11: "lmvt-defBadge",
        }
    ];
    /* 表格数据 */
    TableMockTwo = [
        {
            1: "车体",
            2: "1",
            3: "2",
            4: "3",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
        },
        {
            1: "转向架",
            2: "1",
            3: "2",
            4: "3",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
        }
    ];

    /* 表格数据 */
    TableMockThree = [
        {
            1: "1",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "2",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "3",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "4",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "5",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "6",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "7",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "8",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "9",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "10",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "11",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "12",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "13",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "14",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "15",
            2: "0",
            3: "0",
            4: "0",
        },
        {
            1: "16",
            2: "0",
            3: "0",
            4: "0",
        }
    ];

    /* 表格数据 */
    TableMockThreeKK = [
        {
            1: "1",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "2",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "3",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "4",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "5",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "6",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "7",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "8",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "9",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "10",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "11",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "12",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "13",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "14",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "15",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        },
        {
            1: "16",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
        }
    ];
    /* 表格数据 */
    TableMockThreeKKTwo = [
        {
            1: "1",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "2",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "3",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "4",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "5",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "6",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "6",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "7",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "8",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "9",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "10",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "11",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "12",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "13",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "14",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "15",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
        },
        {
            1: "16",
            2: "0",
            3: "0",
            4: "0",
            5: "0",
            6: "0",
            7: "0",
            8: "0",
            9: "0",
            10: "0",
            11: "0",
            12: "0",
            13: "0",
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
            '<td style="display:none" data-title="ID" data-value="{{ID}}" ></td>',
            '<td data-title="1" data-value="{{1}}" ><div class="{{1}}"></div></td>',
            '<td data-title="2" data-value="{{2}}" ><div class="{{2}}"></div></td>',
            '<td data-title="3" data-value="{{3}}" ><div class="{{3}}"></div></td>',
            '<td data-title="4" data-value="{{4}}" ><div class="{{4}}"></div></td>',

            '<td data-title="5" data-value="{{5}}" ><div class="{{5}}"></div></td>',
            '<td data-title="6" data-value="{{6}}"><div class="{{6}}"></div></td>',
            '<td data-title="7" data-value="{{7}"><div class="{{7}}"></div></td>',
            '<td data-title="8" data-value="{{8}}"><div class="{{8}}"></div></td>',
            '<td data-title="9" data-value="{{9}}"><div class="{{9}}"></div></td>',
            '<td data-title="10" data-value="{{10}}"><div class="{{10}}"></div></td>',
            '<td data-title="11" data-value="{{11}}"><div class="{{11}}"></div></td>',
            '</tr>',
        ].join(""),
        DeviceBodyTwo: [
            '<tr>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" ></td>',
            '<td data-title="1" data-value="{{1}}" >{{1}}</td>',
            '<td data-title="2" data-value="{{2}}" >{{2}}</td>',
            '<td data-title="3" data-value="{{3}}" >{{3}}</td>',
            '<td data-title="4" data-value="{{4}}" >{{4}}</td>',

            '<td data-title="5" data-value="{{5}}" >{{5}}</td>',
            '<td data-title="6" data-value="{{6}}">{{6}}</td>',
            '<td data-title="7" data-value="{{7}">{{7}}</td>',
            '<td data-title="8" data-value="{{8}}">{{8}}</td>',
            '<td data-title="9" data-value="{{9}}">{{9}}</td>',
            '<td data-title="10" data-value="{{10}}">{{10}}</td>',
            '<td data-title="11" data-value="{{11}}">{{11}}</td>',
            '</tr>',
        ].join(""),
        DeviceBodyThree: [
            '<tr>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" ></td>',
            '<td data-title="1" data-value="{{1}}" >{{1}}</td>',
            '<td data-title="2" data-value="{{2}}" >{{2}}</td>',
            '<td data-title="3" data-value="{{3}}" >{{3}}</td>',
            '<td data-title="4" data-value="{{4}}" >{{4}}</td>',
            '</tr>',
        ].join(""),
        DeviceBodyThreeKK: [
            '<tr>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" ></td>',
            '<td data-title="1" data-value="{{1}}" >{{1}}</td>',
            '<td data-title="2" data-value="{{2}}" >{{2}}</td>',
            '<td data-title="3" data-value="{{3}}" >{{3}}</td>',
            '<td data-title="4" data-value="{{4}}" >{{4}}</td>',
            '<td data-title="5" data-value="{{5}}" >{{5}}</td>',
            '<td data-title="6" data-value="{{6}}" >{{6}}</td>',
            '<td data-title="7" data-value="{{7}}" >{{7}}</td>',
            '</tr>',
        ].join(""),
        DeviceBodyThreeKKTwo: [
            '<tr>',
            '<td style="display:none" data-title="ID" data-value="{{ID}}" ></td>',
            '<td data-title="1" data-value="{{1}}" >{{1}}</td>',
            '<td data-title="2" data-value="{{2}}" >{{2}}</td>',
            '<td data-title="3" data-value="{{3}}" >{{3}}</td>',
            '<td data-title="4" data-value="{{4}}" >{{4}}</td>',
            '<td data-title="5" data-value="{{5}}" >{{5}}</td>',
            '<td data-title="6" data-value="{{6}}" >{{6}}</td>',
            '<td data-title="7" data-value="{{7}}" >{{7}}</td>',
            '<td data-title="8" data-value="{{8}}" >{{8}}</td>',
            '<td data-title="9" data-value="{{9}}" >{{9}}</td>',
            '<td data-title="10" data-value="{{10}}" >{{10}}</td>',
            '<td data-title="11" data-value="{{11}}" >{{11}}</td>',
            '<td data-title="12" data-value="{{12}}" >{{12}}</td>',
            '<td data-title="13" data-value="{{13}}" >{{13}}</td>',
            '</tr>',
        ].join("")
    };

    model = $com.Model.create({
        name: '整体式架车机',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();
        },

        events: function () {
            $("body").delegate(".SrcDISplay", "click", function () {
                $this = $(this);
                window.open($this.attr("data-value"));
            });
            window.setFunctionTrigger("MobileCarRackMachine", function (res) {
                mDeviceStatus =  res;
                model.data.StartingUp = res;
                model.com.Refresh();
            });

            //按钮切换

            $("body").delegate(".dropdown-menu li", "click", function () {
                $this = $(this);
                value = $this.attr("data-type");
                if (value == 1) {
                    $(".menuselect").text(".架车机高度");
                    $(".ds-height").show();
                    $(".ds-limit").hide();
                    $(".ds-fault").hide();
                } else if (value == 2) {
                    $(".menuselect").text(".架车机限位");
                    $(".ds-height").hide();
                    $(".ds-limit").show();
                    $(".ds-fault").hide();
                } else if (value == 3) {
                    $(".menuselect").text(".架车机螺母");
                    $(".ds-height").hide();
                    $(".ds-limit").hide();
                    $(".ds-fault").show();
                }
            })
        },

        run: function () {


            /* 沉淀池 0.5个刻度是12px */

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
            $(".lmvt-deviceTwo-body").html($com.util.template(TableMockTwo, HTML.DeviceBodyTwo));


            //起升高度（mm）

            //安全螺母故障
            $(".lmvt-deviceOneNut-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));
            //工作螺母故障
            $(".lmvt-deviceOneNutFailure-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));

            //安全螺母和承载螺母间隙（mm）
            $(".lmvt-deviceOneClearance-body").html($com.util.template(TableMockThreeKK, HTML.DeviceBodyThreeKK));




            //限位报警
            $(".lmvt-deviceTwoLimit-body").html($com.util.template(TableMockThreeKKTwo, HTML.DeviceBodyThreeKKTwo));
            //压力监测&坑急停
            $(".lmvt-deviceTwoPress-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));



            //安全螺母故障
            $(".lmvt-deviceThreeFault1-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));
            //工作螺母故障
            $(".lmvt-deviceThreeFault2-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));
            //电机超温报警
            $(".lmvt-deviceThreeFault3-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));
            //电机超流报警
            $(".lmvt-deviceThreeFault4-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));

            mDevice =JSON.parse( $com.cookie.get("DeviceStatus"));

            model.com.DeviceParameterGet({DeviceID:mDevice.ID},function (res) {

               $(".AllMetroComtain").html($com.util.template(CarList, HTML.MetroContainTop));
               //支架升起高度
               TableMockThree[0]["2"]= res.info.BH11Height;
               TableMockThree[0]["3"]= res.info.BH12Height;
               TableMockThree[0]["4"]= res.info.CH1Height;
               TableMockThree[1]["2"]= res.info.BH21Height;
               TableMockThree[1]["3"]= res.info.BH22Height;
               TableMockThree[1]["4"]= res.info.CH2Height;
               TableMockThree[2]["2"]= res.info.BH31Height;
               TableMockThree[2]["3"]= res.info.BH32Height;
               TableMockThree[2]["4"]= res.info.CH3Height;
               TableMockThree[3]["2"]= res.info.BH41Height;
               TableMockThree[3]["3"]= res.info.BH42Height;
               TableMockThree[3]["4"]= res.info.CH4Height;
               TableMockThree[4]["2"]= res.info.BH51Height;
               TableMockThree[4]["3"]= res.info.BH52Height;
               TableMockThree[4]["4"]= res.info.CH5Height;
               TableMockThree[5]["2"]= res.info.BH61Height;
               TableMockThree[5]["3"]= res.info.BH62Height;
               TableMockThree[5]["4"]= res.info.CH6Height;
               TableMockThree[6]["2"]= res.info.BH71Height;
               TableMockThree[6]["3"]= res.info.BH72Height;
               TableMockThree[6]["4"]= res.info.CH7Height;
               TableMockThree[7]["2"]= res.info.BH81Height;
               TableMockThree[7]["3"]= res.info.BH82Height;
               TableMockThree[7]["4"]= res.info.CH8Height;
               TableMockThree[8]["2"]= res.info.BH91Height;
               TableMockThree[8]["3"]= res.info.BH92Height;
               TableMockThree[8]["4"]= res.info.CH9Height;
               TableMockThree[9]["2"]= res.info.BH101Height;
               TableMockThree[9]["3"]= res.info.BH102Height;
               TableMockThree[9]["4"]= res.info.CH10Height;
               TableMockThree[10]["2"]= res.info.BH111Height;
               TableMockThree[10]["3"]= res.info.BH112Height;
               TableMockThree[10]["4"]= res.info.CH11Height;
               TableMockThree[11]["2"]= res.info.BH121Height;
               TableMockThree[11]["3"]= res.info.BH122Height;
               TableMockThree[11]["4"]= res.info.CH12Height;
               TableMockThree[12]["2"]= res.info.BH131Height;
               TableMockThree[12]["3"]= res.info.BH132Height;
               TableMockThree[12]["4"]= res.info.CH13Height;
               TableMockThree[13]["2"]= res.info.BH141Height;
               TableMockThree[13]["3"]= res.info.BH142Height;
               TableMockThree[13]["4"]= res.info.CH14Height;
               TableMockThree[14]["2"]= res.info.BH151Height;
               TableMockThree[14]["3"]= res.info.BH152Height;
               TableMockThree[14]["4"]= res.info.CH15Height;
               TableMockThree[15]["2"]= res.info.BH161Height;
               TableMockThree[15]["3"]= res.info.BH162Height;
               TableMockThree[15]["4"]= res.info.CH16Height;
               $(".lmvt-deviceOneHeight-body").html($com.util.template(TableMockThree, HTML.DeviceBodyThree));
               TableMockThreeKK[0]["2"] = res.info.BH11NutGap;
               TableMockThreeKK[0]["3"] = res.info.BH12NutGap;
               TableMockThreeKK[0]["4"] = res.info.CH1NutGap;
               TableMockThreeKK[1]["2"] = res.info.BH21NutGap;
               TableMockThreeKK[1]["3"] = res.info.BH22NutGap;
               TableMockThreeKK[1]["4"] = res.info.CH2NutGap;
               TableMockThreeKK[2]["2"] = res.info.BH31NutGap;
               TableMockThreeKK[2]["3"] = res.info.BH32NutGap;
               TableMockThreeKK[2]["4"] = res.info.CH3NutGap;
               TableMockThreeKK[3]["2"] = res.info.BH41NutGap;
               TableMockThreeKK[3]["3"] = res.info.BH42NutGap;
               TableMockThreeKK[3]["4"] = res.info.CH4NutGap;
               TableMockThreeKK[4]["2"] = res.info.BH51NutGap;
               TableMockThreeKK[4]["3"] = res.info.BH52NutGap;
               TableMockThreeKK[4]["4"] = res.info.CH5NutGap;
               TableMockThreeKK[5]["2"] = res.info.BH61NutGap;
               TableMockThreeKK[5]["3"] = res.info.BH62NutGap;
               TableMockThreeKK[5]["4"] = res.info.CH6NutGap;
               TableMockThreeKK[6]["2"] = res.info.BH71NutGap;
               TableMockThreeKK[6]["3"] = res.info.BH72NutGap;
               TableMockThreeKK[6]["4"] = res.info.CH7NutGap;
               TableMockThreeKK[7]["2"] = res.info.BH81NutGap;
               TableMockThreeKK[7]["3"] = res.info.BH82NutGap;
               TableMockThreeKK[7]["4"] = res.info.CH8NutGap;
               TableMockThreeKK[8]["2"] = res.info.BH91NutGap;
               TableMockThreeKK[8]["3"] = res.info.BH92NutGap;
               TableMockThreeKK[8]["4"] = res.info.CH9NutGap;
               TableMockThreeKK[9]["2"] = res.info.BH101NutGap;
               TableMockThreeKK[9]["3"] = res.info.BH102NutGap;
               TableMockThreeKK[9]["4"] = res.info.CH10NutGap;
               TableMockThreeKK[10]["2"] = res.info.BH111NutGap;
               TableMockThreeKK[10]["3"] = res.info.BH112NutGap;
               TableMockThreeKK[10]["4"] = res.info.CH11NutGap;
               TableMockThreeKK[11]["2"] = res.info.BH121NutGap;
               TableMockThreeKK[11]["3"] = res.info.BH122NutGap;
               TableMockThreeKK[11]["4"] = res.info.CH12NutGap;
               TableMockThreeKK[12]["2"] = res.info.BH131NutGap;
               TableMockThreeKK[12]["3"] = res.info.BH132NutGap;
               TableMockThreeKK[12]["4"] = res.info.CH13NutGap;
               TableMockThreeKK[13]["2"] = res.info.BH141NutGap;
               TableMockThreeKK[13]["3"] = res.info.BH142NutGap;
               TableMockThreeKK[13]["4"] = res.info.CH14NutGap;
               TableMockThreeKK[14]["2"] = res.info.BH151NutGap;
               TableMockThreeKK[14]["3"] = res.info.BH152NutGap;
               TableMockThreeKK[14]["4"] = res.info.CH15NutGap;
               TableMockThreeKK[15]["2"] = res.info.BH161NutGap;
               TableMockThreeKK[15]["3"] = res.info.BH162NutGap;
               TableMockThreeKK[15]["4"] = res.info.CH16NutGap;
               $(".lmvt-deviceOneClearance-body").html($com.util.template(TableMockThreeKK, HTML.DeviceBodyThreeKK));
           })

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
            //获取设备信息
            DeviceParameterGet: function (data, fn, context) {
                var d = {
                    $URI: "/DMSDeviceRealParameter/DeviceCurrentAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('提交失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        }
    }),

        model.init();


});