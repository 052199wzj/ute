require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/base/bootstrap-year-calendar'],
	function ($yang, $com, $calendar) {

	    var model,
			HTML,
			DataSource,
			Year,
			Weekend,
			ServerSource,
            WorkShopID,
			IsRefresh;
	    WorkShopID = 0;
	    HTML = {
	        WORKSHOP: [
                 ' <li><a href="javascript:;" class="workshop-select" data-id="{{ID}}" >{{Name}}</a></li>'
	        ].join(''),
	    };
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
	            function arryOnea(data) {
	                var temp = {};
	                var arr = [];
	                var len = data.length;
	                for (var i = 0; i < len; i++) {
	                    if (!temp[data[i].endDate]) {
	                        temp[data[i].endDate] = "abc";
	                        arr.push(data[i]);
	                    }
	                }
	                return arr;
	            };
	            function Refresh() {
	                DataSource[Year] = arryOnea(DataSource[Year]);
	                IsRefresh = true;
	                $('#calendar').calendar({
	                    startYear: Year,
	                    dataSource: DataSource[Year]
	                });
	                IsRefresh = false;
	            }
	            //function Refresh() {
	            //    IsRefresh = true;
	            //    $('#calendar').calendar({
	            //        startYear: Year,
	            //        dataSource: DataSource[Year]
	            //    });
	            //    IsRefresh = false;
	            //}
	            $("body").delegate("#confirm", "click", function () {
	                if (Year < new Date().getFullYear())
	                    return;
	                var _data = model.com.ChangeToSubmit(DataSource[Year]);

	                $com.app.loading("保存中，请稍后。。。");

	                model.com.post({ data: _data, year: Year, WorkShopID: WorkShopID }, [function (rst) {
	                    model.com.get({ year: Year, WorkShopID: WorkShopID }, function (data) {
	                        ServerSource[Year] = data.list;
	                        $.each(ServerSource[Year], function (i, item_ss) {
	                            item_ss.active = 0;
	                        });
	                        DataSource[Year] = model.com.ChangeToShow(data.list);
	                        Refresh();
	                        $com.app.loaded();
	                    });
	                }, function (err) {
	                    model.com.get({ year: Year, WorkShopID: WorkShopID }, function (data) {
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

	            $("body").delegate("li a.workshop-select", "click", function () {
	                var $this = $(this),
                        WorkShopName = $this.html();

	                WorkShopID = Number($this.attr("data-id"));

	                $("#workshopName_span").html(WorkShopName);

	                model.com.get({ year: Year, WorkShopID: WorkShopID }, function (data) {
	                    ServerSource[Year] = data.list;
	                    $.each(ServerSource[Year], function (i, item_ss) {
	                        item_ss.active = 0;
	                    })
	                    DataSource[Year] = model.com.ChangeToShow(data.list);
	                    Refresh();

	                });
                     
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


	                        model.com.get({ year: Year, WorkShopID: WorkShopID }, function (data) {
	                            ServerSource[Year] = data.list;

	                            DataSource[Year] = model.com.ChangeToShow(data.list);

	                            $.each(ServerSource[Year], function (i, item_ss) {
	                                item_ss.Active = 0;
	                            });

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


	                    dataSource: []
	                });
	            });
	            $("body").delegate("#zace-shift-level", "click", function () {
	                var vdata = { 'header': '班次设置', 'href': './factory_model/FMCFactoryShift.html', 'id': 'FMCFactoryShift', 'src': './static/images/menu/factoryModel/factory.png' };
	                window.parent.iframeHeaderSet(vdata);

	            });
	        },

	        run: function () {

				Weekend[Year] = model.com.GetWeekend();
				//工区
				model.com.getFMCWorkShop({ FactoryID: 0, BusinessUnitID: 0 }, function (workshopData) {
	               
	                if (workshopData && workshopData.list && workshopData.list.length > 0) {
	                    WorkShopID = workshopData.list[0].ID;
	                    $("#workshopName_span").html(workshopData.list[0].Name);
	                    $("#workshop_select_ul").html($com.util.template(workshopData.list, HTML.WORKSHOP));
	                } else {
	                    alert("未获取到工区信息！！！");
	                }
                     
	                model.com.get({ year: Year, WorkShopID: WorkShopID }, function (data) {
	                    ServerSource[Year] = data.list;
	                    $.each(ServerSource[Year], function (i, item_ss) {
	                        item_ss.active = 0;
	                    })
	                    DataSource[Year] = model.com.ChangeToShow(data.list);
	                    IsRefresh = true;
	                    $('#calendar').calendar({
	                        dataSource: DataSource[Year]
	                    });
	                    IsRefresh = false;
	                });

	            });
	          
	        },

	        com: {
	            get: function (data, fn, context) {
	                var d = {
	                    $URI: "/Holiday/All",
	                    $TYPE: "get"
	                };

	                function err() {
	                    $com.app.tip('获取失败，请检查网络');
	                }

	                $com.app.ajax($.extend(d, data), fn, err, context);
	            },
	            getFMCWorkShop: function (data, fn, context) {
	                var d = {
	                    $URI: "/FMCWorkShop/All",
	                    $TYPE: "get"
	                };

	                function err() {
	                    $com.app.tip('获取失败，请检查网络');
	                }

	                $com.app.ajax($.extend(d, data), fn, err, context);
	            },
	            post: function (data, fn, context) {
	                var d = {
	                    $URI: "/Holiday/Update",
	                    $TYPE: "post"
	                };

	                function err() {
	                    $com.app.tip('提交失败，请检查网络');
	                }

	                $com.app.ajax($.extend(d, data), fn, err, context);
	            },


	            GetWeekend: function () {
	                var week = {
	                    sat: [],
	                    sun: []
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
	                        Active: 1,
	                        HolidayDate: $com.util.format('yyyy-MM-dd hh:mm:ss', item.startDate),
	                        OperationTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
	                        OperatorID: 0,
	                        OperatorName: "",
	                        Year: Year

	                    });

	                });
	                return _data;
	            },

	            ChangeToShow: function (data) {
	                var _data = [];
	                $.each(data, function (i, item) {
	                    if (item.Active == 0)
	                        return true;
	                    var date = new Date(item.HolidayDate);
	                    _data.push({
	                        startDate: date,
	                        endDate: date,
	                        color: 'RoyalBlue',
	                    });
	                });

	                return _data;
	            }

	        }
	    });

	    model.init();


	});