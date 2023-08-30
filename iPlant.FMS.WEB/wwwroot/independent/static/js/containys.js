require(['./static/utils/js/jquery-3.1.1', './static/utils/js/base/base'],
	function ($zac, $com) {

		var model,
			HTML;
		//隐藏打开变量
		var mMenuState = true;
		var mNum = 0;

		var Data_Menu = [];
		window.User_Info = {};
		window.UserParams = {};
		window.TriggerFunctions = {};

		HTML = {
			Menu_One: ['<div class="zace-first-menu" data-gid="{{ID}}"  data-gname="{{Name}}">',
				'<div class="zace-separator"></div>',
				'<a href="javascript:;">',
				'<img src="{{Icon}}" alt="" /><span>{{Name}}<span>',
				'</a>',
				'</div>'].join(''),

			Menu_One_Separator: ['<div class="zace-separator"></div>'].join(''),

			Menu_Two: ['<div class="zace-second-menu"  data-id="{{ID}}" data-group="{{IsGroup}}" data-default="{{Default}}" data-url="{{Url}}"  data-name="{{Name}}" >',
				'<a href="javascript:;" >  ',
				' <img src="{{Icon}}" alt="" /><span>{{Name}}<span></a>',
				' <div class="zace-second-group-menu" style="display: none;">{{ThridList}}</div>',
				'</div>'].join(''),

			Menu_Thrid: ['<div class="zace-thrid-menu"  data-id="{{ID}}" data-default="{{Default}}"  data-name="{{Name}}" data-url="{{Url}}">',
				'<a href="javascript:;" >  ',
				' <img src="{{Icon}}" alt="" /><span>{{Name}}<span></a>',
				'</div>'].join(''),


			IfarmeHeader: [' <div class="zace-iframe-contain"  data-id="{{id}}"  >',
				'<img src="{{src}}" style=" float:left" />',
				'<div class="iFrame-center" ><span>{{header}}</span></div>',
				'<div class="iFrame-right" ><span class="glyphicon glyphicon-remove"></span>',
				' </div>',
				'</div>'].join(''),

			Iframe: ['   <div class="zace-right-content" data-id="{{id}}"  ',
				'style="width:100%;height:100%;background-color:white">',
				' <iframe src="{{href}}"  frameborder="0"></iframe>',
				'</div>'].join(''),
		};

		model = $com.Model.create({
			name: 'iPlant.MES',

			type: $com.Model.MAIN,

			configure: function () {
				this.run();

			},

			events: function () {
				//打开菜单
				$("body").delegate(".toolbarContent .femi-openClose", "click", function () {
					var $this = $(this);
					//打开或隐藏菜单
					if (mMenuState) {
						mMenuState = false;

						$(".zace-middle-left").css("width", "0");
						$(".zace-middle-left").hide();
						$(".zace-middle-center").css("left", "3px");

						$this.html('<span class="glyphicon glyphicon-eye-open" /><span>打开菜单</span>');

					} else {
						//隐藏菜单
						//width:20%;
						mMenuState = true;
						$(".zace-middle-left").css({
							width: "180px"
						});
						$(".zace-middle-left").show();
						$(".zace-middle-center").css({
							left: "185px"
						});

						$this.html('<span class="glyphicon glyphicon-eye-close" /><span>隐藏菜单</span>');
					}
				});
				$("body").delegate(".toolbarContent .femi-allClose", "click", function () {
					$(".zace-out-right .zace-sub-header .zace-iframe-contain").remove();
					$(".zace-out-right .zace-sub-center .zace-right-content").remove();
				});
				$("body").delegate(".toolbarContent .femi-allClose-bt", "click", function () {
					var $selected = $(".zace-out-right .zace-sub-header .zace-iframe-contain.femi-selected"),
						data_id = $selected.attr("data-id");
					$(".zace-out-right .zace-sub-header .zace-iframe-contain:not(.femi-selected)").remove();
					$(".zace-out-right .zace-sub-center .zace-right-content.not([data-id=" + data_id + "])").remove();
				});
				$("body").delegate(".toolbarContent .femi-fontsize-set", "click", function () {

					$("body").append($com.modal.show({
						fontsize: window.femi_size ? window.femi_size : 0
					}, {
						fontsize: {
							index: 0,
							name: "字体大小",
							type: "ArrayOne",
							control: undefined
						}
					}, "字体设置", function (rst) {


						if (!rst || $.isEmptyObject(rst))
							return;

						var _fontsize = Number(rst.fontsize);
						$com.util.fontsizeChange(_fontsize);

					}, {
						fontsize: [{
							name: "标准",
							value: 0
						}, {
							name: "中",
							value: 2
						}, {
							name: "大",
							value: 4
						}]
					}));
				});
				$("body").delegate(".toolbarContent .femi-reload-config", "click", function () {
					model.com.loadAll();
				});


				//菜单内容与右边导航栏匹配
				//$("body").delegate(".zace-left-center  .zace-second-menu", "click", function () {
				//    var $this = $(this),
				//        data_id = $this.attr("data-id"),
				//        href = $this.attr("data-url"),
				//        header = $this.attr("data-name"),
				//        src = $this.find('a img').attr("src"),
				//        data = { 'header': header, 'href': href, 'id': data_id, 'src': src };

				//    iframeHeaderSet(data);


				//});
				//菜单内容与右边导航栏匹配
				$("body").delegate(".zace-left-center  .zace-second-menu", "click", function () {
					var $this = $(this),
						group = $this.attr("data-group"),
						$SecondContain = $this.closest(".zace-left-center");

					$SecondContain.find(".zace-second-menu[data-group=1] a").removeClass("femi-active");
					$SecondContain.find(".zace-second-menu[data-group=1]").removeClass("femi-active");
					$SecondContain.find(".zace-second-menu[data-group=1] .zace-second-group-menu").hide();


					if (!isNaN(group) && Number(group) == 1) {

						$this.children(".zace-second-group-menu").show();
						$this.children("a").addClass("femi-active");
						$this.addClass("femi-active");
						return;
					}

					var data_id = $this.attr("data-id"),
						href = $this.attr("data-url"),
						header = $this.attr("data-name"),

						_default = Number($this.attr('data-default')),
						src = $this.find('a img').attr("src"),

						data = {
							'header': header,
							'href': href,
							'id': data_id,
							'src': src,
							'_default': _default
						};


					if (data._default == 0) {

						//调用用户接口获取用户加密信息 (data-id)（密钥界面输入） 在Module下需要添加字段
						model.com.getUserSecret({
							ModuleID: data.id
						}, function (res) {
							var str = $com.uri.setUrlQuery(res.info);
							if (data.href.indexOf("?") < 0) {
								data.href = data.href + "?" + str;
							} else {
								data.href = model.com.insert_flg(data.href, str, data.href.indexOf("?") + 1);
							}
							iframeHeaderSet(data);
						});
					} else {
						iframeHeaderSet(data);
					}

				});

				$("body").delegate(".zace-left-center  .zace-thrid-menu", "click", function () {
					var $this = $(this),
						data_id = $this.attr("data-id"),
						href = $this.attr("data-url"),
						header = $this.attr("data-name"),

						_default = Number($this.attr('data-default')),
						src = $this.find('a img').attr("src"),

						data = {
							'header': header,
							'href': href,
							'id': data_id,
							'src': src,
							'_default': _default
						};


					if (data._default == 0) {

						//调用用户接口获取用户加密信息 (data-id)（密钥界面输入） 在Module下需要添加字段
						model.com.getUserSecret({
							ModuleID: data.id
						}, function (res) {
							var str = $com.uri.setUrlQuery(res.info);
							if (data.href.indexOf("?") < 0) {
								data.href = data.href + "?" + str;
							} else {
								data.href = model.com.insert_flg(data.href, str, data.href.indexOf("?") + 1);
							}
							iframeHeaderSet(data);
						});
					} else {
						iframeHeaderSet(data);
					}

				});

				//导航栏点击事件
				$("body").delegate(".zace-sub-header .zace-iframe-contain", "click", function () {
					var $this = $(this),
						data_id = $this.attr("data-id");

					$(".zace-out-right .zace-sub-header .zace-iframe-contain").removeClass("femi-selected");
					$(".zace-out-right .zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").addClass("femi-selected");


					$(".zace-out-right .zace-sub-center .zace-right-content").hide();
					$(".zace-out-right .zace-sub-center .zace-right-content[data-id=" + data_id + "]").show();

				});

				//菜单栏的上部伸缩
				$('body').delegate('.zace-left-top .zace-first-menu', 'click', function () {
					var $this = $(this),
						$Next = $this.nextAll('.zace-first-menu'),
						topNum = $('.zace-left-top .zace-first-menu').length;

					topNum -= $Next.length;


					model.com.renderMenu(Data_Menu, topNum);

					return false;

				});

				////菜单栏的下部伸缩
				$('body').delegate('.zace-left-bom .zace-first-menu', 'click', function () {
					var $this = $(this),
						$Prev = $this.prevAll('.zace-first-menu'),
						topNum = $('.zace-left-top .zace-first-menu').length;


					topNum += ($Prev.length + 1);
					model.com.renderMenu(Data_Menu, topNum);

					return false;

				});
				//配置 添加项
				$("body").delegate(".toolbarContent .lmvt-add-item", "click", function () {
					var DEFAULT_VALUE = {
						Menu: 0
					},
						KEYWORD_LIST = [
							"Menu|菜单选项|ArrayOne",
						],
						KEYWORD_LISTItem = {},
						FORMATTRT_LevelItem = {},
						TypeSource = {
							Menu: [
								{
									name: "WEB端",
									value: 0,
								},
								{
									name: "客户端",
									value: 1,
								},
								{
									name: "APP端",
									value: 2,
								}
							]
						};
					$.each(KEYWORD_LIST, function (i, item) {
						var detail = item.split("|");
						KEYWORD_LISTItem[detail[0]] = {
							index: i,
							name: detail[1],
							type: detail.length > 2 ? detail[2] : undefined,
							control: detail.length > 3 ? detail[3] : undefined
						};
						if (detail.length > 2) {
							FORMATTRT_LevelItem[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
						}
					});
					$("body").append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, "菜单设置", function (rst) {
						//调用插入函数 
						if (!rst || $.isEmptyObject(rst))
							return;


						switch (Number(rst.Menu)) {
							case 0:
								window.iframeHeaderSet({
									'header': 'Web菜单设置',
									'href': './basic_Set/WebMenu.html',
									'id': 'WebMenu',
									'src': './static/images/menu/factoryRoute/station.png'
								});
								break;
							case 1:
								window.iframeHeaderSet({
									'header': '客户菜单设置',
									'href': './basic_Set/ClientMenu.html',
									'id': 'ClientMenu',
									'src': './static/images/menu/factoryRoute/station.png'
								});
								break;
							case 2:
								window.iframeHeaderSet({
									'header': 'APP菜单设置',
									'href': './basic_Set/AppMenu.html',
									'id': 'AppMenu',
									'src': './static/images/menu/factoryRoute/station.png'
								});
								break;
							default:
								break;
						}
						//model.com.postCommandSave({
						//    data: PositionTemp,
						//}, function (res) {

						//});

					}, TypeSource));
				});
				//处理导航栏的去掉事件
				$("body").delegate(".zace-sub-header .zace-iframe-contain .iFrame-right", "click", function () {
					var $this = $(this),
						$paren = $this.closest(".zace-iframe-contain"),
						data_id = $paren.attr("data-id"),
						$show = undefined,
						show_id = undefined;

					if ($paren.hasClass("femi-selected")) {


						if ($paren.next(".zace-iframe-contain")[0]) {
							$show = $paren.next(".zace-iframe-contain");
							show_id = $show.attr("data-id");
						} else if ($paren.prev(".zace-iframe-contain")[0]) {
							$show = $paren.prev(".zace-iframe-contain");
							show_id = $show.attr("data-id");
						}

						$(".zace-out-right .zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").remove();
						$(".zace-out-right .zace-sub-center .zace-right-content[data-id=" + data_id + "]").remove();

					} else {
						$(".zace-out-right .zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").remove();
						$(".zace-out-right .zace-sub-center .zace-right-content[data-id=" + data_id + "]").remove();
					}

					if ($show && show_id) {
						$(".zace-out-right .zace-sub-header .zace-iframe-contain[data-id=" + show_id + "]").addClass("femi-selected");
						$(".zace-out-right .zace-sub-center .zace-right-content[data-id=" + show_id + "]").show();
						$show.show();
					}

					return false;
				});

				//注销
				$("body").delegate(".femi-log-out", "click", function () {
					model.com.close({}, function () {
						window.location.href = "../index.html";
					});
				});

				//帮助
				$("body").delegate(".femi-header-helper", "click", function () {

					//待定
				});

				var $zace_out_right = $(".zace-out-right");


				window.iframeHeaderSet = function (data) {

					var data_id = data.id;
					window.UserParams[data_id] = data;

					if (data.refresh) {
						$zace_out_right.find(".zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").remove();
						$zace_out_right.find(".zace-out-right .zace-sub-center .zace-right-content[data-id=" + data_id + "]").remove();
					}

					if (!$zace_out_right.find(".zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]")[0]) {
						$zace_out_right.find(".zace-sub-header").append($com.util.template(data, HTML.IfarmeHeader));
						$zace_out_right.find(".zace-sub-center").append($com.util.template(data, HTML.Iframe));

					}
					$zace_out_right.find(".zace-sub-header .zace-iframe-contain").removeClass("femi-selected");

					$zace_out_right.find(".zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").addClass("femi-selected");

					$zace_out_right.find(".zace-sub-header .zace-iframe-contain[data-id=" + data_id + "]").show();


					var Lenght = $zace_out_right.find(".zace-sub-header .zace-iframe-contain:visible").length;
					var $ShowOne = $zace_out_right.find(".zace-sub-header .zace-iframe-contain:not(.femi-selected):visible")[0] ? $($zace_out_right.find(".zace-sub-header .zace-iframe-contain:not(.femi-selected):visible")[0]) : undefined;

					if ((Lenght * 140 + 10) > $zace_out_right.width() && $ShowOne) {
						$ShowOne.hide();
					}

					//iframe 展示当前的链接
					$zace_out_right.find(".zace-sub-center .zace-right-content").hide();
					$zace_out_right.find(".zace-sub-center .zace-right-content[data-id=" + data_id + "]").show();
				};



			},

			run: function () {
				//window._grad=Number(model.query.Grad);


				var wLoad = 0;
				$com.app.loading("正在加载配置！");

				model.com.getUserAll({
					active: 2
				}, function (res) {
					window._UserAll = res.list;
					wLoad++;
				});

				model.com.getBusiness({}, function (res) {
					window._Business = res.list;
					wLoad++;
				});
				model.com.getFactory({}, function (res) {
					window._Factory = res.list;
					wLoad++;
				});
				model.com.getWorkShop({}, function (res) {
					window._WorkShop = res.list;
					wLoad++;

				});
				model.com.getLine({}, function (res) {
					window._Line = res.list;
					wLoad++;
				});
				model.com.getStation({}, function (res) {
					window._Station = res.list;
					wLoad++;
				});
				model.com.getDevice({}, function (res) {
					window._Device = res.list;
					wLoad++;
				});
				model.com.getSpare({}, function (res) {
					window._Spare = res.list;
					wLoad++;
				});

				var ShiftCurrent = function () {
					model.com.getCurrentShift({}, function (res) {
						window._CurrentShift = res.info;
					});
					// setTimeout(ShiftCurrent, 60000);
				}
				ShiftCurrent();

				var LoadConfig = function () {
					if (wLoad >= 8) {

						model.com.get({
							Type: 1
						}, function (res) {
							if (res && res.info && res.info.module)
								Data_Menu = res.info.module;
							if (res && res.info && res.info.user)
								window.User_Info = res.info.user;

							window.parent._grad = res.info.user.Grad;
							if (res.info.user.Grad < 1000) {
								$(".lmvt-add-item").hide();
							} else {
								$(".lmvt-add-item").show();
							}
							$com.app.loaded();


							model.com.renderMenu(Data_Menu, 1);

							$(".zace-onload-company img").attr("src", window.User_Info.CompanyFaces);
							$(".zace-onload-company a span").text(window.User_Info.CompanyName);
							$(".zace-onload-user img").attr("src", window.User_Info.Faces);
							$(".zace-onload-user  a span").text(window.User_Info.Name);

							window.iframeHeaderSet({
								'header': '全厂生产概况',
								'href': './basic_Set/KanbanCar_first.html',
								'id': '373',
								'src': '/MESCore/upload/2020/03/31/161452_8710f965-46f2-408d-9529-d494dd87982f.png'
							});

						});
					} else {
						setTimeout(LoadConfig, 100);
					}
				}
				LoadConfig();

			},

			com: {
				get: function (data, fn, context) {
					var d = {
						$URI: "/HomePage/Show",
						$TYPE: "get"
					};

					function err() {
						$com.app.tip('主页加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getUserAll: function (data, fn, context) {
					var d = {
						$URI: "/User/All",
						$TYPE: "get"
					};

					function err() {
						console.log('人员加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getFactory: function (data, fn, context) {
					var d = {
						$URI: "/FMCFactory/All",
						$TYPE: "get"
					};

					function err() {
						console.log('工厂加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getBusiness: function (data, fn, context) {
					var d = {
						$URI: "/BusinessUnit/All",
						$TYPE: "get"
					};

					function err() {
						console.log('事业部加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getWorkShop: function (data, fn, context) {
					var d = {
						$URI: "/FMCWorkShop/All",
						$TYPE: "get"
					};

					function err() {
						console.log('车间加载失败，请检查网络');

					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getLine: function (data, fn, context) {
					var d = {
						$URI: "/FMCLine/All",
						$TYPE: "get"
					};

					function err() {
						console.log('产线加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getStation: function (data, fn, context) {
					var d = {
						$URI: "/FMCStation/All",
						$TYPE: "get"
					};

					function err() {
						console.log('工位加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getDevice: function (data, fn, context) {
					var d = {
						$URI: "/DeviceLedger/All",
						$TYPE: "get"
					};

					function err() {
						console.log('设备加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getSpare: function (data, fn, context) {
					var d = {
						$URI: "/SpareLedger/All",
						$TYPE: "get"
					};

					function err() {
						console.log('备件加载失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				//菜单配置
				getUserSecret: function (data, fn, context) {
					var d = {
						$URI: "/User/InfoSecret",
						$TYPE: "get"
					};

					function err() {
						console.log('用户信息获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},
				getCurrentShift: function (data, fn, context) {
					var d = {
						$URI: "/SCHShift/CurrentShiftID",
						$TYPE: "get"
					};

					function err() {
						console.log("服务连接失败，请检查网络");
						//console.log('服务连接失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},

				getInfo: function (data, fn, context) {
					var d = {
						$URI: "/User/Info",
						$TYPE: "get"
					};

					function err() {
						console.log('个人信息获取失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},

				load: function (data, fn, context) {
					var d = {
						$URI: "/MESConfig/Load",
						$TYPE: "post"
					};

					function err() {
						console.log('重新载入配置失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);
				},

				close: function (data, fn, context) {
					var d = {
						$URI: "/User/Logout",
						$TYPE: "post"
					};

					function err() {
						$com.app.tip('注销失败，请检查网络');
					}

					$com.app.ajax($.extend(d, data), fn, err, context);

				},

				renderMenu: function (data, top) {

					if (!data || data.length < 1 || data.length < top)
						return;

					var _data = $com.util.Clone(data);
					var _Onedata = [];
					var _TwoGroup = [];
					$.each(_data, function (i, item) {
						if (!item.GroupID || item.GroupID <= 0) {
							_Onedata.push(item);

						} else {
							_TwoGroup.push(item);
						}
					});


					$.each(_Onedata, function (one_i, one_item) {
						$.each(_TwoGroup, function (i, item) {
							if (item.GroupID && item.GroupID > 0 && item.GroupID == one_item.ID) {
								item.IsGroup = 1;
								item.Url = "";
								item.Default = 0;
								item.ThridList = $com.util.template(item.ModuleList, HTML.Menu_Thrid);

								one_item.ModuleList.push(item);
							}
						});
					});


					$('.zace-left-top').html($com.util.template(_Onedata.slice(0, top), HTML.Menu_One));

					$('.zace-left-center').html($com.util.template(_Onedata[top - 1].ModuleList, HTML.Menu_Two));


					$('.zace-left-bom  .zace-first-menu').remove();
					$('.zace-left-bom').prepend($com.util.template(_Onedata.slice(top, _Onedata.length), HTML.Menu_One));


					$($('.zace-left-top .zace-first-menu .zace-separator')[0]).remove();
					//$($('.zace-left-top .zace-first-menu')[0]).css("height","27px");

					$('.zace-left-top').css("height", (top * 33 - 6) + 'px');

					$('.zace-left-bom').css("height", ((_Onedata.length - top) * 33 + 5) + 'px');

					$('.zace-left-center').css("top", (top * 33 - 6) + 'px')
						.css("bottom", ((_Onedata.length - top) * 33 + 5) + 'px');
				},

				loadAll: function () {
					var wLoad = 0;
					$com.app.loading("正在加载配置！");

					model.com.getUserAll({
						active: 2
					}, function (res) {
						window._UserAll = res.list;
						wLoad++;
					});

					model.com.getBusiness({}, function (res) {
						window._Business = res.list;
						wLoad++;
					});
					model.com.getFactory({}, function (res) {
						window._Factory = res.list;
						wLoad++;
					});
					model.com.getWorkShop({}, function (res) {
						window._WorkShop = res.list;
						wLoad++;

					});
					model.com.getLine({}, function (res) {
						window._Line = res.list;
						wLoad++;
					});
					model.com.getStation({}, function (res) {
						window._Station = res.list;
						wLoad++;
					});
					model.com.getDevice({}, function (res) {
						window._Device = res.list;
						wLoad++;
					});
					model.com.getSpare({}, function (res) {
						window._Spare = res.list;
						wLoad++;
					});
					var LoadConfig = function () {
						if (wLoad >= 8) {

							model.com.load({}, function (res) {

								$com.app.loaded();
								alert("重载配置成功!");

							});
						} else {
							setTimeout(LoadConfig, 100);
						}
					}
					LoadConfig();

				}
			}
		});

		model.init();
	});