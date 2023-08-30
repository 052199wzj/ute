require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-year-calendar'],
    function ($yang, $com, $calendar) {

        var model,
            HTML,
            DataSource,
            Year,
            Weekend,
            ServerSource,
            IsRefresh;

        HTML = {};
        IsRefresh = false;
        Year = new Date().getFullYear();
        DataSource = [];
        ServerSource = [];
        Weekend = [];
        model = $com.Model.create({
            name: 'iPlant.MES',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();
            },

            events: function () {

                function Refresh() {
                    IsRefresh = true;
                    $('#calendar').calendar({
                        startYear: Year,
                        dataSource: DataSource[Year],
                    });
                    IsRefresh = false;
                }

                $("body").delegate("#confirm", "click", function () {
                    if (Year < new Date().getFullYear())
                        return;
                    var data = model.com.ChangeToSubmit(DataSource[Year]);

                    $com.app.loading("保存中，请稍后。。。");
                    model.com.post({data: ServerSource[Year], year: Year}, function (rst) {
                        model.com.post({data: data, year: Year}, [function (rst) {
                            model.com.get({year: Year}, function (data) {
                                ServerSource[Year] = data.list;
                                $.each(ServerSource[Year], function (i, item_ss) {
                                    item_ss.active = 0;
                                });
                                DataSource[Year] = model.com.ChangeToShow(data.list);
                                Refresh();
                                $com.app.loaded();
                            });
                        }, function (err) {
                            model.com.get({year: Year}, function (data) {
                                ServerSource[Year] = data.list;
                                $.each(ServerSource[Year], function (i, item_ss) {
                                    item_ss.active = 0;
                                });
                                DataSource[Year] = model.com.ChangeToShow(data.list);
                                Refresh();
                                $com.app.loaded();
                            });
                        }]);
                    });

                });
                $("body").delegate("#saturday", "click", function () {
                    if (Year < new Date().getFullYear())
                        return;
                    $.each(Weekend[Year].sat, function (i, item) {
                        if (item <= new Date()) {
                            return true;
                        }

                        DataSource[Year].push({
                            startDate: item,
                            endDate: item,
                            color: 'RoyalBlue',
                        });
                    });

                    Refresh();

                });
                $("body").delegate("#sunday", "click", function () {
                    if (Year < new Date().getFullYear())
                        return;
                    $.each(Weekend[Year].sun, function (i, item) {
                        if (item <= new Date()) {
                            return true;
                        }

                        DataSource[Year].push({
                            startDate: item,
                            endDate: item,
                            color: 'RoyalBlue',
                        });
                    });
                    Refresh();
                });
                $("body").delegate("#weekend", "click", function () {
                    if (Year < new Date().getFullYear())
                        return;
                    $.each(Weekend[Year].sat, function (i, item) {
                        if (item <= new Date()) {
                            return true;
                        }
                        DataSource[Year].push({
                            startDate: item,
                            endDate: item,
                            color: 'RoyalBlue',
                        });

                    });
                    $.each(Weekend[Year].sun, function (i, item) {
                        if (item <= new Date()) {
                            return true;
                        }
                        DataSource[Year].push({
                            startDate: item,
                            endDate: item,
                            color: 'RoyalBlue',
                        });
                    });
                    Refresh();
                });
                $("body").delegate("#restSet", "click", function () {
                    if (Year < new Date().getFullYear())
                        return;

                    var _data = [];
                    for (var i = 0; i < DataSource[Year].length; i++) {
                        if (DataSource[Year][i].startDate <= new Date())
                            _data.push(DataSource[Year][i]);
                    }
                    DataSource[Year] = _data;
                    Refresh();
                });

                $(function () {

                    $('#calendar').calendar({
                        enableRangeSelection: false,
                        startYear: Year,
                        renderEnd: function (e) {
                            if (IsRefresh)
                                return;
                            Year = e.currentYear;
                            if (Year >= new Date().getFullYear())
                                Weekend[Year] = model.com.GetWeekend();


                            model.com.get({year: Year}, function (data) {
                                ServerSource[Year] = data.list;
                                $.each(ServerSource[Year], function (i, item_ss) {
                                    item_ss.active = 0;
                                });
                                DataSource[Year] = model.com.ChangeToShow(data.list);
                                Refresh();
                            });
                        },

                        clickDay: function (e) {

                            if (e.date <= new Date())
                                return;
                            var _index = -1;
                            if (DataSource && DataSource[Year]) {
                                _index = $com.util.findIndex(DataSource[Year], function (data) {

                                    return (data.startDate - e.date) == 0 && (data.endDate - e.date) == 0;

                                });
                            } else {
                                DataSource = [];
                                DataSource[Year] = [];
                            }

                            if (_index >= 0) {
                                DataSource[Year].splice(_index, 1);
                            } else {
                                DataSource[Year].push({
                                    startDate: e.date,
                                    endDate: e.date,
                                    color: 'RoyalBlue',
                                });
                            }
                            Refresh();
                        },


                        dataSource: [],
                    });
                });
            },

            run: function () {

                Weekend[Year] = model.com.GetWeekend();
                this.com.get({year: Year}, function (data) {
                    ServerSource[Year] = data.list;
                    $.each(ServerSource[Year], function (i, item_ss) {
                        item_ss.active = 0;
                    });
                    DataSource[Year] = model.com.ChangeToShow(data.list);
                    IsRefresh = true;
                    $('#calendar').calendar({
                        dataSource: DataSource[Year],
                    });
                    IsRefresh = false;
                });
            },

            com: {
                get: function (data, fn, context) {
                    var d = {
                        $URI: "/holiday/all",
                        $TYPE: "get",
                    };

                    function err() {
                        $com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                post: function (data, fn, context) {
                    var d = {
                        $URI: "/holiday/update",
                        $TYPE: "post",
                    };

                    function err() {
                        $com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },


                GetWeekend: function () {
                    var week = {
                            sat: [],
                            sun: [],
                        },
                        td,
                        day,
                        d;

                    for (var m = 0; m < 12; m++) {
                        for (var i = 1; i <= 31; i++) {
                            td = new Date(Year, m, i);
                            day = td.getDay();
                            d = td.getDate();
                            if (!isNaN(day)) {
                                if (day == 0) {
                                    week.sun.push(td);
                                } else if (day == 6) {
                                    week.sat.push(td);
                                }
                            }
                        }
                    }

                    return week;
                },

                ChangeToSubmit: function (data) {
                    var _data = [];
                    $.each(data, function (i, item) {
                        _data.push({
                            active: 1,
                            holidayDate: item.startDate.getTime(),
                            operationTime: new Date().getTime(),
                            operatorID: 0,
                            operatorName: "",
                            year: Year,

                        });

                    });
                    return _data;
                },

                ChangeToShow: function (data) {
                    var _data = [];
                    $.each(data, function (i, item) {
                        var date = new Date(item.holidayDate);
                        _data.push({
                            startDate: date,
                            endDate: date,
                            color: 'RoyalBlue',
                        });
                    });

                    return _data;
                },

            },
        });

        model.init();


    });