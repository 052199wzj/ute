require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base', '../static/utils/js/echarts.min'], function ($zace, $com, $echarts) {

	var KEYWORD,
		KEYWORD_LIST,
		model,
		DEFAULT_VALUE,
		TypeSource,
		DataAll,
		FORMATTRT,
		DataAllSearch,
		mGrad,
		wRoleTree,
		HTML;
	mActive = 1;
	var p_flag = false;
	DataAllSearch = [];
	DataPosition = [];
	KEYWORD_LIST = [

		"StartDate|日期|Date"
	];

	HTML = {
		TableItemNode: [
			'<tr data-color="">',

			'<td style="display: none;" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',

			'<td data-title="CarNo" data-value="{{CarNo}}" >{{CarNo}}</td>',
			'<td data-title="ExcType" data-value="{{ExcType}}" >{{ExcType}}</td>',

			'<td data-title="ExcDescription" data-value="{{ExcDescription}}" >{{ExcDescription}}</td>',
			'<td data-title="CreateTime" data-value="{{CreateTime}}" >{{CreateTime}}</td>',
			'<td data-title="Creator" data-value="{{Creator}}" >{{Creator}}</td>',

			'<td data-title="Editor" data-value="{{Editor}}" >{{Editor}}</td>',
			//'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
			'</tr>',
		].join(""),

		TableFirstNode: [
			'<tr data-color="">',

			'<td style="display: none;" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',

			'<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
			'<td data-title="DayNum" data-value="{{DayNum}}" >{{DayNum}}</td>',

			'<td data-title="WeekNum" data-value="{{WeekNum}}" >{{WeekNum}}</td>',
			'<td data-title="MontNum" data-value="{{MontNum}}" >{{MontNum}}</td>',
			'<td data-title="SumNum" data-value="{{SumNum}}" >{{SumNum}}</td>',
			//'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
			'</tr>',
		].join(""),
		TableSecondNode: [
			'<tr data-color="">',
			'<td style="display: none;" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
			'<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
			'<td colspan="4"  data-title="DayNum" data-value="{{DayNum}}" >{{DayNum}}</td>',
			//'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
			'</tr>',
		].join(""),

		TableSThirdNode: [
			'<tr data-color="">',
			'<td style="display: none;" data-title="WID" data-value="{{WID}}" >{{WID}}</td>',
			'<td data-title="Name" data-value="{{Name}}" >{{Name}}</td>',
			'<td colspan="2"  data-title="DayNum" data-value="{{DayNum}}" >{{DayNum}}</td>',
			'<td colspan="2"  data-title="WeekNum" data-value="{{WeekNum}}" >{{WeekNum}}</td>',
			//'<td data-title="DepartureDate" data-value="{{DepartureDate}}" >{{DepartureDate}}</td>',
			'</tr>',
		].join(""),


		TableRoleUserItemNode: [
			'<tr data-color="">',
			// '<td><input type="checkbox" class="femi-tb-checkbox" style="margin: 1px 0px 1px" /></td>',
			'<td data-title="FunctionID" data-value="">{{RoleName}}</td>',
			'<td data-title="RoleID" data-value="">{{Text}}</td>',
			'</tr>',
		].join(""),

	}
	FORMATTRT = {};
	DataAll = [];
	KEYWORD = {};
	DEFAULT_VALUE = {
		Name: "",
		DepartmentID: 0,
		Position: 0,
		//Manager: 0,
		Phone: "",
		// WeiXin: "",
		// Email: "",
		//PhoneMAC: 0,
		//Active: 0
	};
	TypeSource = {
		Active: [
			{
				name: "未使用",
				value: 0
			}, {
				name: "启用",
				value: 1
			}, {
				name: "禁用",
				value: 2
			}],
		DepartmentID: [{
			name: "无",
			value: 0
		}],
		Position: [{
			name: "无",
			value: 0,
			far: 0
		}],
		Manager: [{
			name: "无",
			value: 0
		}],
	};

	$.each(KEYWORD_LIST, function (i, item) {
		var detail = item.split("|");
		KEYWORD[detail[0]] = {
			index: i,
			name: detail[1],
			type: detail.length > 2 ? detail[2] : undefined,
			control: detail.length > 3 ? detail[3] : undefined
		};
		if (detail.length > 2) {
			FORMATTRT[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
		}
	});
	model = $com.Model.create({
		name: '生产日报',

		type: $com.Model.MAIN,

		configure: function () {
			this.run();

		},

		events: function () {




			//刷新
			$("body").delegate("#zace-refresh-user", "click", function () {

				p_flag = true;
				model.com.refresh(p_flag);
			});

			//条件查询
			$("body").delegate("#zace-search-search", "click", function () {
				var default_value = {
					// DepartmentID: 0,
					StartDate: $com.util.format('yyyy-MM-dd', new Date(mStartDate)),
				};
				$("body").append($com.modal.show(default_value, KEYWORD, "查询", function (rst) {


					if (!rst || $.isEmptyObject(rst))
						return;

					mStartDate = $com.util.format('yyyy-MM-dd', new Date(rst.StartDate));

					model.com.refresh();

				}, TypeSource));

			});

		},

		run: function () {

			mStartDate = $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 24 * 3600000));
			//开始日期
			mStartTime = $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 24 * 3600000));
			//结束日期
			mEndTime = $com.util.format('yyyy-MM-dd', new Date(new Date().getTime() - 24 * 3600000));



			model.com.refresh();

		},

		com: {
			addDate: function (date, days) {
				//	if (days == undefined || days == '') {
				if (days == undefined) {
					days = 1;
				}
				var date = new Date(date);
				date.setDate(date.getDate() + days);
				var month = date.getMonth() + 1; //月份从0开始所以需要+1
				// month = month < 10 ? '0' + month : month;
				var day = date.getDate();
				// day = day < 10 ? '0' + day : day;
				return date.getFullYear() + '年' + month + '月' + day + '日';
			},
			refresh: function (p_flag) {
				$com.app.loading('数据加载中。。。');
				mYear = new Date(mStartDate).getFullYear();
				mMonth = new Date(mStartDate).getMonth() + 1;
				mDay = new Date(mStartDate).getDate();

				//$('.zace-header-title').text(mYear+'年'+mMonth+'月'+mDay+'日'+'生产信息日报');


				mStartTime = $com.util.format('yyyy-MM-dd', new Date(mStartDate)) + ' 00:00:00';
				mEndTime = $com.util.format('yyyy-MM-dd', new Date(mStartDate)) + ' 23:59:59';
				$('.zace-header-title').text('生产信息日报' + '(' + model.com.addDate(mStartDate, 0) + ')');
				model.com.getWorkAreaAll({ 'ID': -1, 'Active': -1 }, function (res) {
					var adarr = {};
					var _RroNameList = [];
					var _RroIDList = [];
					var _RroNumList = [];
					var _RroC6NumList = [];
					if (res && res.list) {

						res.list.sort(function (a, b) { return Number(b.OrderNum) - Number(a.OrderNum) });
						$.each(res.list, function (i, item) {

							if (item.Active == 1 && item.WorkAreaID > 0&&!adarr[item.StationName]) {
								adarr[item.StationName] = {name:'text'};
								_RroNameList.push({
									value:item.StationName,
									ZaceID:item.StationID,
								});
								_RroIDList.push(item.StationID);
								_RroNumList.push(0);
								_RroC6NumList.push(0);

							}

						});

					}

					//model.com.getProData({ LineID: 0, ShiftDate: mStartDate, ShiftPeriod: 4 }, function (resP) {
					model.com.getProData({ StartTime: mStartTime, EndTime: mEndTime }, function (resP) {
						if (!resP)
							return;

						var dataFirst = [{
							Name: '机车竣工台数(C5修)',
							DayNum: 0,
							WeekNum: 0,
							MontNum: 0,
							SumNum: 0,
						},

						{
							Name: '机车竣工台数(C6修)',
							DayNum: 0,
							WeekNum: 0,
							MontNum: 0,
							SumNum: 0,
						},
						{
							Name: '机车进厂台数(C5修)',
							DayNum: 0,
							WeekNum: 0,
							MontNum: 0,
							SumNum: 0,
						},
						{
							Name: '机车进厂台数(C6修)',
							DayNum: 0,
							WeekNum: 0,
							MontNum: 0,
							SumNum: 0,
						}
						];

						var dataSecond = [
							{
								Name: '机车在厂/在修台数',
								C5NUm: 0,
								C6NUm: 0,
								DayNum: '/',

							},
						];
						var dataThird = [
							{
								Name: 'C5修/C6修',

								DayNum: '/',
								WeekNum: '/',

							},
						];

						var dataFour = [
							{
								Name: '机车在厂/在修台数(C5修)',

								DayNum: '/',
								WeekNum: '/',

							},
							{
								Name: '机车在厂/在修台数(C6修)',

								DayNum: '/',
								WeekNum: '/',

							},
						];
						$.each(resP.list, function (i, item) {

							if (item.LineID == 1) {
								dataFirst[0].DayNum = item.Finsh,
									dataFirst[0].WeekNum = item.WeekFinsh,
									dataFirst[0].MontNum = item.MonthFinsh,
									dataFirst[0].SumNum = item.YearFinsh;

								dataFirst[2].DayNum = item.Enter,
									dataFirst[2].WeekNum = item.WeekEnter,
									dataFirst[2].MontNum = item.MonthEnter,
									dataFirst[2].SumNum = item.YearEnter;
								dataThird[0].DayNum = item.RealPlant + '/' + item.RealRepair;


							} else if (item.LineID == 2) {
								dataFirst[1].DayNum = item.Finsh,
									dataFirst[1].WeekNum = item.WeekFinsh,
									dataFirst[1].MontNum = item.MonthFinsh,
									dataFirst[1].SumNum = item.YearFinsh;

								dataFirst[3].DayNum = item.Enter,
									dataFirst[3].WeekNum = item.WeekEnter,
									dataFirst[3].MontNum = item.MonthEnter,
									dataFirst[3].SumNum = item.YearEnter;

								dataThird[0].WeekNum = item.RealPlant + '/' + item.RealRepair;
							}

							dataSecond[0].C5NUm += item.RealPlant;
							dataSecond[0].C6NUm += item.RealRepair;

						});

						dataSecond[0].DayNum = dataSecond[0].C5NUm + '/' + dataSecond[0].C6NUm;

						dataFour[0].DayNum = dataThird[0].DayNum;
						dataFour[1].DayNum = dataThird[0].WeekNum;

						(function () {

							$("#femi-riskLevelBasic-tbody").html($com.util.template(dataFirst, HTML.TableFirstNode));
							$("#femi-riskLevelBasic-tbody").append($com.util.template(dataFour, HTML.TableSecondNode));
							// $("#femi-riskLevelBasic-tbody").append($com.util.template(dataSecond, HTML.TableSecondNode));
							// $("#femi-riskLevelBasic-tbody").append($com.util.template(dataThird, HTML.TableSThirdNode));
						})();


						model.com.getEXCLevelData({ StartTime: mStartTime, EndTime: mEndTime }, function (resP) {
							if (!resP)
								return;
							var _ExceptionLevel =
								[
									{ value: 0, name: 'A级' ,ZaceID: 1},
									{ value: 0, name: 'B级',ZaceID: 2 },
									{ value: 0, name: 'C级' ,ZaceID: 3},
									{ value: 0, name: 'D级' ,ZaceID: 4},


								];

							var _ExceptionType = [
								{ value: 0, name: '人员',ZaceID: 3 },
								{ value: 0, name: '设备' ,ZaceID: 1},
								{ value: 0, name: '物料' ,ZaceID: 2},
								{ value: 0, name: '工艺' ,ZaceID: 4},
								{ value: 0, name: '环境' ,ZaceID: 5},
								{ value: 0, name: '检测' ,ZaceID: 6},

							];

							$.each(resP.list, function (i, item) {

								switch (item.ResponseLevel) {
									case "A":
										_ExceptionLevel[0].value += item.Times;
										break;
									case "B":
										_ExceptionLevel[1].value += item.Times;
										break;
									case "C":
										_ExceptionLevel[2].value += item.Times;
										break;
									case "D":
										_ExceptionLevel[3].value += item.Times;
										break;

									default:
										break;
								};

								switch (item.Type) {
									case '人员':
										_ExceptionType[0].value += item.Times;
										break;
									case '设备':
										_ExceptionType[1].value += item.Times;
										break;
									case '物料':
										_ExceptionType[2].value += item.Times;
										break;
									case '工艺':
										_ExceptionType[3].value += item.Times;
										break;
									case '环境':
										_ExceptionType[4].value += item.Times;
										break;
									case '检测':
										_ExceptionType[5].value += item.Times;
										break;
									default:
										break;
								}



							});
							var myChartException = $echarts.init(document.getElementById('Exception'));
							(function () {



								var _title = [];
								$.each(_ExceptionLevel, function (i, item) {

									item.name = item.name + ':' + item.value;
									_title.push(item.name);
								});

								// 指定图表的配置项和数据
								var option = {
									title: {
										text: '异常等级统计',
										//subtext: '纯属虚构',
										left: 'center'
									},
									tooltip: {
										trigger: 'item',
										formatter: '{a} <br/>{b} ({d}%)'
									},
									legend: {
										orient: 'vertical',
										left: 'right',
										//data: ['A级', 'B级', 'C级', 'D级'],
										data: _title,
										zlevel: 1
									},
									series: [
										{
											name: '等级统计',
											type: 'pie',
											radius: '75%',
											center: ['40%', '60%'],
											data: _ExceptionLevel,
											emphasis: {
												itemStyle: {
													shadowBlur: 10,
													shadowOffsetX: 0,
													shadowColor: 'rgba(0, 0, 0, 0.5)'
												}
											}
										}
									]
								};


								// 使用刚指定的配置项和数据显示图表。
								myChartException.setOption(option);
								myChartException.on('dblclick', function (params) {

									var wid=params.data.ZaceID;
									var vdata = { 'header': '异常记录', 'href': './exception_management/exceptionRecord.html?startT=' + mStartTime + '&endT=' +mEndTime +'&respond=' + wid+ '&exception=-1' , 'id': 'exceptionRecord', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
									window.parent.iframeHeaderSet(vdata);
									window.callFunctionTrigger("exceptionRecord", { StartT:mStartTime,EndT:mEndTime,Respond:wid,Exception:-1});



								});

							})();

							var myChartExceptionType = $echarts.init(document.getElementById('ExceptionType'));
							(function () {

								var _title = [];
								$.each(_ExceptionType, function (i, item) {

									item.name = item.name + ':' + item.value;
									_title.push(item.name);
								});
								// 指定图表的配置项和数据
								var option = {
									title: {
										text: '异常类型统计',
										//subtext: '纯属虚构',
										left: 'center'
									},
									tooltip: {
										trigger: 'item',
										formatter: '{a} <br/>{b}  ({d}%)'
									},
									legend: {
										orient: 'vertical',
										left: 'right',
										//data: ['人员', '设备', '物料', '工艺', '环境', '检测'],
										data: _title
									},
									series: [
										{
											name: '类型统计',
											type: 'pie',
											radius: '75%',
											center: ['40%', '60%'],
											data: _ExceptionType,
											emphasis: {
												itemStyle: {
													shadowBlur: 10,
													shadowOffsetX: 0,
													shadowColor: 'rgba(0, 0, 0, 0.5)'
												}
											}
										}
									]
								};

								// 使用刚指定的配置项和数据显示图表。
								myChartExceptionType.setOption(option);
								myChartExceptionType.on('dblclick', function (params) {
									// alert(encodeURIComponent(params.name));
									// myChart2.on('dblclick', function (params) {
									// 	window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
									// });
									var wid=params.data.ZaceID;
									var vdata = { 'header': '异常记录', 'href': './exception_management/exceptionRecord.html?startT=' + mStartTime + '&endT=' +mEndTime +'&respond=-1' + '&exception=' + wid, 'id': 'exceptionRecord', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
									window.parent.iframeHeaderSet(vdata);
									window.callFunctionTrigger("exceptionRecord", { StartT:mStartTime,EndT:mEndTime,Respond:-1,Exception:wid});

								});
							})();



							model.com.getEXCAll({ ShiftDate: mStartDate, Level: 0, APSShiftPeriod: 4 }, function (resP) {
								if (!resP)
									return;
								var _TaskList = [];
								$.each(resP.list, function (i, item) {

									if (item.RespondLevel == 1) {
										var _temp = {
											CarNo: item.PartNo,
											ExcType: item.ExceptionTypeName,
											ExcDescription: item.Remark,
											CreateTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date(item.CreateTime)),
											Creator: item.ApplyName,
											Editor: item.Operators,
										};
										_TaskList.push(_temp);
									}

								});
								(function () {
									data = _TaskList;
									$("#femi-riskLevelExcep-tbody").html($com.util.template(data, HTML.TableItemNode));
								})();


								//NCR
								model.com.getNCRQuery({ StartTime: mStartTime, EndTime: mEndTime }, function (resP) {
									if (!resP)
										return;

									var _NCRType =
										[
											{ value: 0, name: 'I级',ZaceID:1 },
											{ value: 0, name: 'II级' ,ZaceID:2},
											{ value: 0, name: 'III级',ZaceID:3 },
										];



									$.each(resP.list, function (i, item) {

										switch (item.LevelName) {
											case "I":
												_NCRType[0].value += item.Frequency;
												break;
											case "II":
												_NCRType[1].value += item.Frequency;
												break;
											case "III":
												_NCRType[2].value += item.Frequency;
												break;
											default:
												break;
										};

									});
									var myChartNCRType = $echarts.init(document.getElementById('NCRType'));
									(function () {
										var _title = [];
										$.each(_NCRType, function (i, item) {

											item.name = item.name + ':' + item.value;
											_title.push(item.name);
										});
										// 指定图表的配置项和数据
										var option = {
											title: {
												text: '不合格评审等级统计',
												//subtext: '纯属虚构',
												left: 'center'
											},
											tooltip: {
												trigger: 'item',
												//formatter: '{a} <br/>{b} : {c} ({d}%)'
												formatter: '{a} <br/>{b} ({d}%)'
											},
											legend: {
												orient: 'vertical',
												left: 'right',
												// data: ['I类', 'II类', 'III类'],
												data: _title,
												zlevel: 1
											},
											series: [
												{
													name: '等级统计',
													type: 'pie',
													radius: '75%',
													center: ['40%', '60%'],
													data: _NCRType,
													emphasis: {
														itemStyle: {
															shadowBlur: 10,
															shadowOffsetX: 0,
															shadowColor: 'rgba(0, 0, 0, 0.5)'
														}
													}
												}
											]
										};

										// 使用刚指定的配置项和数据显示图表。
										myChartNCRType.setOption(option);
										myChartNCRType.on('dblclick', function (params) {
											// alert(encodeURIComponent(params.name));
											var wid=params.data.ZaceID;
											var vdata = { 'header': '不合格评审', 'href': './factory_route/ncr_task.html?startT=' + mStartTime + '&endT=' +mEndTime +'&respond=-1' + '&level=' + wid, 'id': 'ncr_taskZace', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
											window.parent.iframeHeaderSet(vdata);
											window.callFunctionTrigger("ncr_taskZace", { StartT:mStartTime,EndT:mEndTime,Respond:-1,Level:wid});
										
										
										});
									})();

									//RRO
									model.com.getRROQuery({ StartTime: mStartTime, EndTime: mEndTime }, function (resP) {
										if (!resP)
											return;


										$.each(resP.list, function (i, item) {

											$.each(_RroIDList, function (k, item_k) {
												if (item.StationID == item_k && item.LineID == 1) {
													_RroNumList[k] = item.Frequency;

												}
												if (item.StationID == item_k && item.LineID == 2) {
													_RroC6NumList[k] = item.Frequency;

												}
											});


										});
									
										var myChart1 = $echarts.init(document.getElementById('ReworkRecord'));
										(function () {

											// 指定图表的配置项和数据
											var option = {
												title: {
													text: '工位返修统计图',
													// subtext: '数据来自网络'
													left: 'center'
												},
												tooltip: {
													trigger: 'axis',
													axisPointer: {
														type: 'shadow'
													}
												},
												legend: {
													// data: ['2011年', '2012年']工位返修统计图
													data: ['C5', 'C6'],
													zlevel: 100,
													orient: 'vertical',
													left: 'right',
												},
												grid: {
													left: '3%',
													right: '4%',
													bottom: '3%',
													containLabel: true
												},
												xAxis: {
													type: 'value',
													boundaryGap: [0, 0.01],
													minInterval: 1
												},
												yAxis: {
													type: 'category',
													//data: ['机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运','机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '机车交验', '机车试运', '淋雨试验', '高压试验', '低压试验', '淋雨试验', '高压试验', '低压试验']
													data: _RroNameList,
													max: function (value) {
														if (value.max < 5) {
															value.max = 5;
														} else {
															value.max = value.max;
														}
														return value.max;
													},
												},
												series: [
													{
														name: 'C5',
														type: 'bar',
														//data: [0,0, 0, 0, 0, 26, 10,10, 20, 30, 50, 100, 26, 10, 0, 30, 50, 100, 26, 10, 20, 30, 0, 100, 26, 0, 20, 30, 50, 100, 26, 100, 26, 10, 20, 30, 50, 0, 26, 10, 20, 0, 30, 20, 30, 30,]
														data: _RroNumList
													},
													{
														name: 'C6',
														type: 'bar',
														//data: [0,0, 0, 0, 0, 26, 10,10, 20, 30, 50, 100, 26, 10, 0, 30, 50, 100, 26, 10, 20, 30, 0, 100, 26, 0, 20, 30, 50, 100, 26, 100, 26, 10, 20, 30, 50, 0, 26, 10, 20, 0, 30, 20, 30, 30,]
														data: _RroC6NumList
													},
												],

												dataZoom: [



												],


											};

											// 使用刚指定的配置项和数据显示图表。
											myChart1.setOption(option);
											myChart1.on('dblclick', function (params) {
												var wid=-1;
												for (var k = 0; k < _RroNameList.length; k++) {
													if(_RroNameList[k].value==params.name){
														wid=_RroNameList[k].ZaceID;
													}
													
												}
												var vdata = { 'header': '返修', 'href': './factory_route/repair_task.html?startT=' + mStartTime + '&endT=' +mEndTime +'&respond=-1' + '&level=' + wid, 'id': 'repair_taskZace', 'src': './static/images/menu/newfactoryModel/techniquePartpoint.png' };
												window.parent.iframeHeaderSet(vdata);

												window.callFunctionTrigger("repair_taskZace", { StartT:mStartTime,EndT:mEndTime,Level:wid});
											});
										})();


										window.onresize = function () {
											myChart1.resize();
											myChartNCRType.resize();
											myChartExceptionType.resize();
											myChartException.resize();
										};
										$com.app.loaded();

									});

								});



							});
						});

					});


				});



			},
			//不合格
			getNCRQuery: function (data, fn, context) {
				var d = {
					$URI: "/NCR/QueryFrequency",
					$TYPE: "get",
					$SERVER: '/MESWDW',

				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			//返修
			getRROQuery: function (data, fn, context) {
				var d = {
					$URI: "/RRO/QueryFrequency",
					$TYPE: "get",
					$SERVER: '/MESWDW',

				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

			//计划维修
			getProData: function (data, fn, context) {
				var d = {
					//$URI: "/RPTProductShift/Info",
					$URI: "/RPTProductShift/All",
					$TYPE: "get",
					$SERVER: "/MESAPS"

				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getEXCLevelData: function (data, fn, context) {
				var d = {
					$URI: "/EXCAndon/ExcLevelTypeTimes",
					$TYPE: "get",
					$SERVER: '/MESEXC',

				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			getEXCAll: function (data, fn, context) {
				var d = {
					$URI: "/EXCAndon/ExceptionAll",
					$TYPE: "get",
					$SERVER: '/MESEXC',

				};

				function err() {
					$com.app.tip('获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},


			getWorkAreaAll: function (data, fn, context) {
				var d = {
					$URI: "/LFS/WorkAreaAll",
					$TYPE: "Get",
					$SERVER: "/MESLFS"
				};

				function err() {
					$com.app.tip('获取库位列表失败，请检查网络!');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},

		}
	});

	model.init();


});
