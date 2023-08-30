define(["../jquery-3.1.1", "./bootstrap"], function ($yang, Bs) {

	'use strict';
	(function () {
		var elems = $([]),
			jq_resize = $.resize = $.extend($.resize, {}),
			timeout_id,
			str_setTimeout = 'setTimeout',
			str_resize = 'resize',
			str_data = str_resize + '-special-event',
			str_delay = 'delay',
			str_throttle = 'throttleWindow';
		jq_resize[str_delay] = 100;
		jq_resize[str_throttle] = true;
		$.event.special[str_resize] = {
			setup: function () {
				if (!jq_resize[str_throttle] && this[str_setTimeout]) {
					return false;
				}
				var elem = $(this);
				elems = elems.add(elem);
				$.data(this, str_data, {
					w: elem[0].offsetWidth,
					h: elem.outerHeight(true)
				});
				if (elems.length === 1) {
					loopy();
				}
			},
			teardown: function () {
				if (!jq_resize[str_throttle] && this[str_setTimeout]) {
					return false;
				}
				var elem = $(this);
				elems = elems.not(elem);
				elem.removeData(str_data);
				if (!elems.length) {
					clearTimeout(timeout_id);
				}
			},
			add: function (handleObj) {
				if (!jq_resize[str_throttle] && this[str_setTimeout]) {
					return false;
				}
				var old_handler;

				function new_handler(e, w, h) {
					var elem = $(this),
						data = $.data(this, str_data);
					data.w = w !== undefined ? w : elem[0].offsetWidth;
					data.h = h !== undefined ? h : elem.outerHeight(true);
					old_handler.apply(this, arguments);
				}

				if ($.isFunction(handleObj)) {
					old_handler = handleObj;
					return new_handler;
				} else {
					old_handler = handleObj.handler;
					handleObj.handler = new_handler;
				}
			}
		};

		function loopy() {
			timeout_id = window[str_setTimeout](function () {
				elems.each(function () {
					var elem = $(this),
						width = elem[0].offsetWidth,
						height = elem.outerHeight(true),
						data = $.data(this, str_data);
					//if (width !== data.w || height !== data.h) {
					elem.trigger(str_resize, [data.w = width, data.h = height]);
					// }
				});
				loopy();
			}, jq_resize[str_delay]);
		}
	})();
	(function () {
		window.alert = function (msg, callback, _title) {
			app.loaded();
			if (msg && msg.length > 200) {
				msg = msg.substr(0, 197) + "...";
			}

			var div_old = document.getElementById("femi-alert-div");
			var div;
			var name;
			if (div_old) {
				div = div_old;
			} else {
				div = document.createElement("div");
				div.innerHTML = "<style type='text/css'>"
					+ ".nbaMask { position: fixed; z-index: 9998; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
					+ ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
					+ ".nbaDialog { position: fixed; z-index: 9999; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"
					+ ".nbaDialog .nbaDialogHd { padding: 8px 15px  ; }                                                                                                                                                                                                                         "
					+ ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; color:#CD853F}                                                                                                                                                                                                           "
					+ ".nbaDialog .nbaDialogBd { padding: 10px .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color:#808080;height:auto; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
					+ ".nbaDialog .nbaDialogFt:after { content: ' '; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
					+ ".nbaDialog .nbaDialogBtn {font-weight: bold; display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #2F4F4F	; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "
					+ ".nbaDialog .nbaDialogBtn:after { content: ' '; " +
					"position: absolute; left: 0; top: 0; width: 1px; bottom: 0;" +
					"border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0;" +
					" transform-origin: 0 0; -webkit-transform: scaleX(0.5);" +
					" transform: scaleX(0.5); }             "
					+ ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
					+ "</style>"
					+ "<div id='dialogs2' style='display: none'>"
					+ "<div class='nbaMask'></div>"
					+ "<div class='nbaDialog'>"
					+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle'  >提示</strong>"
					+ " </div>"
					+ " <div class='nbaDialogBd' id='dialog_msg2'>弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"
					/*+ " <div class='nbaDialogHd'>"
					+ "     <strong class='nbaDialogTitle' style='color:#2F4F4F'></strong>"
					+ " </div>"*/
					+ " <div class='nbaDialogFt'>"
					+ "     <a href='javascript:;' class='nbaDialogBtn nbaDialogBtnPrimary' id='dialog_ok2'>确定</a>"
					+ " </div>"
					+ "</div>"
					+ "</div>";
				document.body.appendChild(div);
				div.setAttribute("id", "femi-alert-div");
			}

			var dialogs2 = document.getElementById("dialogs2");
			dialogs2.style.display = 'block';

			var dialog_msg2 = document.getElementById("dialog_msg2");
			dialog_msg2.innerHTML = msg;
			if (_title) {
				var nbaDialogTitle = document.getElementById("nbaDialogTitle");
				nbaDialogTitle.innerHTML = _title;
			}

			var dialog_ok2 = document.getElementById("dialog_ok2");
			dialog_ok2.onclick = function () {



				div.parentNode.removeChild(div);
				if (callback)
					callback();
			};
		};

		window.femi_click = function () {
			location.reload(true);
		}

		$.fn.removeCss = function (options) {
			var type = typeof (options);
			if (type === "string") {
				this.each(function () {
					var style = $(this).attr("style");

					if (!style) {
						return false;
					}
					var arr = style.split(";");
					style = "";
					for (var i = 0; i < arr.length; i++) {
						if ($.trim(arr[i]) == "") {
							continue;
						}
						var att = arr[i].split(":");
						if ($.trim(att[0]) == $.trim(options)) {
							continue;
						}
						style += $.trim(arr[i]) + ";";
					}
					$(this).attr("style", style);
				});
			} else if ($.isArray(options)) {
				this.each(function () {
					var style = $(this).attr("style");

					if (!style) {
						return false;
					}

					var arr = style.split(";");
					style = "";
					for (var i = 0; i < arr.length; i++) {
						for (var j = 0; j < options.length; j++) {
							if ($.trim(arr[i]) == "") {
								break;
							}
							var att = arr[i].split(":");
							if ($.trim(att[0]) == $.trim(options[j])) {
								arr[i] = "";
								continue;
							}
						}
					}
					for (var i = 0; i < arr.length; i++) {
						if ($.trim(arr[i]) != "") {
							style += $.trim(arr[i]) + ";";
						}
					}
					if ($.trim(style) == "") {
						$(this).removeAttr("style");
					} else {
						$(this).attr("style", style);
					}
				});
			}
		};

		window.setFunctionTrigger = function (fnName, fn) {
			if (!fnName || fnName.length < 1 || !fn) {
				return;
			}
			if (window.parent) {
				if (!window.parent.TriggerFunctions)
					window.parent.TriggerFunctions = {};
				window.parent.TriggerFunctions[fnName] = fn;
			}

		}
		window.callFunctionTrigger = function (fnName, data) {
			if (!fnName || fnName.length < 1) {
				return;
			}
			if (window.parent && window.parent.TriggerFunctions && window.parent.TriggerFunctions[fnName])
				window.parent.TriggerFunctions[fnName](data);
		}

		//主页的移动下拉条
		$("body").delegate(".femi-neck ul.femi-neck-float li.femi-fl-lf div.femi-menu-bg", "mouseover", function () {

			var $this = $(this);
			$this.css("background-color", "#00688B");
			$this.css("overflow", "visible");
		}).delegate(".femi-neck-float li.femi-fl-lf div", "mouseout", function () {

			var $this = $(this);
			$this.removeCss("background-color");
			$this.css("overflow", "hidden");
		});

		//表头的全选全不选事件
		$("body").delegate(".femi-tb-scroll table.table thead tr th input[type=checkbox].femi-tb-checkbox", "change", function (e) {

			var $this = $(this),
				$table = $this.closest("table"),
				$tableDiv = $table.closest(".lmvt-tb-show");

			if ($tableDiv[0]) {
				$table = $tableDiv.prev("table.table");
			}

			if ($this[0].checked) {
				$table.find("tbody tr td input[type=checkbox].femi-tb-checkbox").prop("checked", true);
				$table.find("tbody tr").each(function (i, item) {
					var $tr = $(this);
					$tr.css('background-color', '#f0cf89')

				});
			} else {
				$table.find("tbody tr td input[type=checkbox].femi-tb-checkbox").prop("checked", false);
				$table.find("tbody tr").each(function (i, item) {
					var $tr = $(this);

					$tr.removeCss('background-color');

				});
			}

		});


		$(window).scroll(function () {

			$(".femi-tb-scroll").each(function (i, item) {
				var $table = $(item).children("table.table"),
					$Div = $(item).children("div.lmvt-tb-show");

				if (!$table[0] || !$Div[0])
					return;
				var _left = Number($Div.attr("data-left-value"));
				if (isNaN(_left)) {
					_left = $Div[0].offsetLeft;
					$Div.attr("data-left-value", _left);
				}

				var __left = $(window).scrollLeft();
				_left -= __left;
				$Div.css("left", _left + "px");

			});


		});
		//表头固定
		$(".femi-tb-scroll>table.table").resize(function (e) {

			var $table = $(this).closest("table.table"),
				$scroll = $table.closest(".femi-tb-scroll"),
				size = 1;

			if ($table.is(":hidden") || !$table.offset().top || $table.offset().top == 0)
				return false;


			var scroll = $scroll[0];
			if (!size || isNaN(size) || size <= 0) {
				size = 1;
			}

			// 将表格拷贝一份  
			//var tbP = $("#department-table")
			var tb1 = $table[0];
			var tb2 = undefined;

			var IsOwn = ($scroll.children("div").children("table.table").length > 0);

			var bak = undefined;

			if (IsOwn) {
				tb2 = $scroll.children("div").children("table.table")[0];
				// 创建一个div   
				bak = $scroll.children("div")[0];
			} else {
				tb2 = tb1.cloneNode(true);
				bak = document.createElement("div");

			}

			if (!IsOwn) {
				// 将div添加到滚动条容器中  
				scroll.appendChild(bak);
				// 将拷贝得到的表格在删除数据行后添加到创建的div中  
				bak.appendChild(tb2);
			}


			// 获取表格的行数  
			var len = tb2.rows.length;
			tb2.style.marginBottom = 0;
			// 将拷贝得到的表格中非表头行删除  
			for (var i = tb2.rows.length; i > size; i--) {
				// 每次删除数据行的第一行  
				tb2.deleteRow(size);
			}
			for (var i = 0; i < tb1.rows[0].cells.length; i++) {
				tb2.rows[0].cells[i].width = tb1.rows[0].cells[i].offsetWidth;
			}

			// 设置创建的div的left属性为0，即该div与滚动条容器紧贴  
			// bak.style.left = $table.offset().left + "px";

			bak.style.height = $table.find("thead").height() + "px";
			tb2.style.height = $table.find("thead").height() + "px";

			tb2.style.width = $table.width() + 2 + "px";
			bak.style.left = ($table.offset().left - $(window).scrollLeft()) + "px";

			// 设置div的top属性为0，初期时滚动条位置为0，此属性与left属性协作达到遮盖原表头  
			if (!IsOwn) {
				// 设置创建的div的position属性为absolute，即绝对定于滚动条容器（滚动条容器的position属性必须为relative）  
				bak.style.position = "fixed";


				bak.style.overflow = "visiable";
				// 设置创建的div的背景色与原表头的背景色相同（貌似不是必须）  
				bak.style.backgroundColor = "white";
				// 设置div的display属性为block，即显示div（貌似也不是必须，但如果你不希望总是显示拷贝得来的表头，这个属性还是有用处的）  
				bak.style.display = "block";

				$table.find("thead").css("visibility", "hidden");
				bak.style.top = $table.offset().top + "px";
				bak.style.left = ($table.offset().left - $(window).scrollLeft()) + "px";
				bak.classList.add("lmvt-tb-show");
			}


		});

		//表格行的点击事件 为点击事件做checked处理
		$("body").delegate(".femi-tb-scroll table.table  tr", "click", function (e) {
			var $this = $(this);
			if ($this.children('th')[0]) {

				return true;
			}
			var $check = $this.children('td').children("input[type=checkbox].femi-tb-checkbox");
			if ($check[0].checked) {
				$this.removeCss("background-color");
				$check.prop("checked", false);
				$check.change();
			} else {
				$this.css("background-color", "#f0cf89");
				$check.prop("checked", true);
				$check.change();
			}


		});
		//表格行的点击事件 为点击checked做处理
		$("body").delegate(".femi-tb-scroll table.table tr td input[type=checkbox].femi-tb-checkbox", "click", function (e) {

			var $this = $(this);

			if ($this[0].checked)
				$this.prop("checked", false);
			else
				$this.prop("checked", true);
		});


	})();

	//为toolBar填充按钮
	$(function () {
		var ToolBar = [
			'<button type="button" class="btn_add btn btn-default" >',
			'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>新增',
			'</button>',
			'<button type="button" class="btn btn-default btn_edit" > ',
			'<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>修改',
			'</button>',
			'<button type="button" class="btn btn-default btn_delete"> ',
			'<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>删除 ',
			'</button>',
			'<button type="button" class="btn btn-default btn_active">',
			'<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>激活 ',
			'</button>',
			'<button type="button" class="btn btn-default btn_disable">',
			'<span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>禁用',
			'</button>',
			'<div class="btn-group femi-excel-dropdown" role="group">',
			'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ',
			'<span class="glyphicon glyphicon-link" aria-hidden="true"></span> Excel ',
			'<span class="caret"></span>',
			'</button> ',
			'<ul class="dropdown-menu"> ',
			'<li><a href="javascript:;" class="export_excel">导出</a></li>',
			'<li><a href="javascript:;" class="import_excel">导入</a></li>',
			'</ul> ',
			'</div>',
			'<button type="button" class="btn btn-default btn_search">',
			'<span class="glyphicon glyphicon-search" aria-hidden="true"></span>查询',
			'</button>',
			'<button type="button" class="btn btn-default btn_refresh">',
			'<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>刷新 ',
			'</button>',
		].join("");

		$(".femi-table-toolbar").html(ToolBar);

		util.fontsizeChange();
	});

	//Split
	$(function () {
 


		$(".mouse-move-contain .mouse-move-middle").each(function (i, item) {
			var $this = $(this),
				$contain = $this.closest(".mouse-move-contain"),
				has_expander = isNaN($this.attr("data-expander")) ? 0 : Number($this.attr("data-expander"));
			if (has_expander != 1) {
				$this.prepend(" <div class='mouse-move-expander move-horizontal'> </div>");
				$this.attr("data-expander", 1);
			}


			var _maxH = isNaN($this.attr("data-max-height")) ? 0 : Number($this.attr("data-max-height"));
			var _minH = isNaN($this.attr("data-min-height")) ? 0 : Number($this.attr("data-min-height"));
			var _defaultH = isNaN($this.attr("data-height")) ? 0 : Number($this.attr("data-height"));

			if (_defaultH < _minH)
				_defaultH = _minH;
			if (_defaultH > _maxH)
				_defaultH = _maxH;

			$this.css("height", _defaultH);
			$contain.children(".mouse-move-bottom").css("top", _defaultH);

		});



		$(".mouse-move-contain .mouse-move-left").each(function (i, item) {
			var $this = $(this),
				$contain = $this.closest(".mouse-move-contain"),
				has_expander = isNaN($this.attr("data-expander")) ? 0 : Number($this.attr("data-expander"));
			if (has_expander != 1) {
				$this.prepend(" <div class='mouse-move-expander move-vertical'> </div>");
				$this.attr("data-expander", 1);
			}

			var _maxW = isNaN($this.attr("data-max-width")) ? 0 : Number($this.attr("data-max-width"));
			var _minW = isNaN($this.attr("data-min-width")) ? 0 : Number($this.attr("data-min-width"));
			var _defaultW = isNaN($this.attr("data-width")) ? 0 : Number($this.attr("data-width"));

			if (_defaultW < _minW)
				_defaultW = _minW;
			if (_defaultW > _maxW)
				_defaultW = _maxW;

			$this.css("width", _defaultW);
			$contain.children(".mouse-move-right").css("left", _defaultW);

		});




		$("body").delegate(".mouse-move-contain .mouse-move-expander", "mouseover", function (e) {
			$(this).attr("data-down", 1);
		});

		//鼠标按下事件
		$("body").delegate(".mouse-move-contain .mouse-move-expander", "mousedown", function (e) {

			if (isNaN($(this).attr("data-down")) || Number($(this).attr("data-down")) != 1)
				return;


			$(this).attr("data-y", e.pageY);

			$(this).attr("data-x", e.pageX);

			//按下  动作  1
			$(this).attr("data-action", 1);

			return false;

		});

		//鼠标移动
		$("body").delegate(".mouse-move-contain", "mousemove", function (e) {
			var $contain = [],
				$expander = $(this).find(".mouse-move-expander");
			$expander.each(function (i, item) {

				if (isNaN($(item).attr("data-action")) || Number($(item).attr("data-action")) != 1)
					return true;

				$contain = $(item).closest(".mouse-move-contain");
				$expander = $(item);
			});

			if (!$contain[0])
				return;


			var _X = e.pageX - Number($expander.attr("data-x"));
			var _Y = e.pageY - Number($expander.attr("data-y"));


			if ($expander.hasClass("move-vertical")) {
				//左右布局
				var destWidth = $contain.children(".mouse-move-left").width() + _X;

				var _maxW = isNaN($contain.children(".mouse-move-left").attr("data-max-width")) ? 0 : Number($contain.children(".mouse-move-left").attr("data-max-width"));
				var _minW = isNaN($contain.children(".mouse-move-left").attr("data-min-width")) ? 0 : Number($contain.children(".mouse-move-left").attr("data-min-width"));

				if (destWidth < _minW)
					return;

				if (destWidth > _maxW)
					return;

				$contain.children(".mouse-move-left").css("width", destWidth);
				$contain.children(".mouse-move-right").css("left", destWidth);

			} else if ($expander.hasClass("move-horizontal")) {
				//上下 布局
				var destHeight = $contain.children(".mouse-move-middle").height() + _Y;

				var _maxH = isNaN($contain.children(".mouse-move-middle").attr("data-max-height")) ? 0 : Number($contain.children(".mouse-move-middle").attr("data-max-height"));
				var _minH = isNaN($contain.children(".mouse-move-middle").attr("data-min-height")) ? 0 : Number($contain.children(".mouse-move-middle").attr("data-min-height"));

				if (destHeight < _minH)
					return;

				if (destHeight > _maxH)
					return;

				$contain.children(".mouse-move-middle").css("height", destHeight);
				$contain.children(".mouse-move-bottom").css("top", destHeight);
			}

			//赋值
			$expander.attr("data-x", e.pageX);
			$expander.attr("data-y", e.pageY);


		});

		//松开
		$(".mouse-move-contain").mouseup(function (e) {

			$(this).find(".mouse-move-expander").attr("data-action", 0);

		});
		//超出界面
		$(".mouse-move-contain").mouseleave(function (e) {
			$(this).find(".mouse-move-expander").attr("data-down", 0);
			$(this).find(".mouse-move-expander").attr("data-action", 0);
		});


	});




	Bs($);

	var tableTool = {
		getSelectionTitle: function ($tableBd, ID_Title) {
			var _IDs = [];
			$tableBd.children("tr").each(function (i, item) {
				var $checkbox = $(item).children('td').children("input[type=checkbox].femi-tb-checkbox");

				if (!$checkbox[0] || !$checkbox[0].checked) {
					return true;
				}

				var $idNode = $(item).children('td[data-title=' + ID_Title + ']');
				var _id = Number($idNode.attr("data-value"));

				if (isNaN(_id))
					return true;

				_IDs.push(_id)
			});
			return _IDs;
		},

		getSelectionData: function ($tableBd, ID_Title, source) {
			var _SelectData = [],
				$tr = $tableBd.children("tr");

			$tr.each(function (i, item) {
				var $checkbox = $(item).children('td').children("input[type=checkbox].femi-tb-checkbox");

				if (!$checkbox[0] || !$checkbox[0].checked) {
					return true;
				}

				var $idNode = $(item).children('td[data-title=' + ID_Title + ']');
				var _id = $idNode.attr("data-value");

				if (_id == undefined || _id.length < 1)
					return true;

				var _index = util.findIndex(source, function (p) {
					return p[ID_Title] == _id;
				});
				if (_index < 0) {
					return true;
				}
				_SelectData.push(source[_index]);
			});
			return _SelectData;
		},

		getTypeSource: function (data_list, Value_Title, Name_Title, Conndition, Far_Title, Son_Title) {
			var isPush = true,
				_Source = [];
			$.each(data_list, function (i, item) {
				isPush = true;
				if (Conndition) {
					for (var p in Conndition) {
						if (item[p] == undefined || item[p] != Conndition[p]) {
							isPush = false;

						}
					}
				}
				if (isPush) {
					_Source.push({
						value: item[Value_Title],
						name: item[Name_Title],
						far: Far_Title ? item[Far_Title] : undefined
					});
				}

				if (!Son_Title)
					return true;
				if (util.isArray(Son_Title)) {
					if (Son_Title.length < 1)
						return true;

					var son_source = item;
					$.each(Son_Title, function (i_s, item_s) {
						if (!son_source[item_s])
							return false;
						son_source = son_source[item_s];
					});
					_Source = _Source.concat(tableTool.getTypeSource(son_source, Value_Title, Name_Title, Far_Title, Conndition, Son_Title));
					return true;
				}
				if (!item[Son_Title])
					return true;

				_Source = _Source.concat(tableTool.getTypeSource(item[Son_Title], Value_Title, Name_Title, Far_Title, Conndition, Son_Title));
			});
			return _Source;
		},

		getFilterSource: function (data_list, Conndition) {
			var isPush = true,
				_Source = [];
			$.each(data_list, function (i, item) {
				isPush = true;
				if (Conndition) {
					for (var p in Conndition) {
						if (item[p] == undefined || item[p] != Conndition[p]) {
							isPush = false;

						}
					}
				}

				if (isPush) {
					_Source.push(item);
				}
			});
			return _Source;
		},

		//导出
		getExportParams: function ($table, fileName, Title) {
			var params = {
				data: [],
				head: {},
				order: [],
				fileName: fileName,
				title: Title
			};

			$table = $table.closest(".femi-tb-scroll").children("table.table");

			$table.find('thead tr th[data-order]').each(function (i, item) {
				var _title = $(item).attr('data-order'),
					text = $(item).text();

				params.order.push(_title);

				params.head[_title] = text;
			});

			$table.find('tbody tr').each(function (i_t, tr) {

				var $tr = $(tr),
					row = {},
					isPush = false;

				$tr.find('td[data-title]').each(function (i_d, td) {
					var $td = $(td),
						_title = $td.attr('data-title'),
						text = $td.text();

					if (!params.head[_title])
						return true;

					row[_title] = text;

					isPush = true;
				});
				if (isPush)
					params.data.push(row);
			});

			return params;
		},

		//导入
		postExportParams: function (source, $table) {
			var result = [],
				HeadOrder = {};

			$table = $table.closest(".femi-tb-scroll").children("table.table");

			$table.find('thead tr th[data-order]').each(function (i, item) {
				var _title = $(item).attr('data-order'),
					text = $(item).text();

				HeadOrder[text] = _title;
			});

			$.each(source, function (i, item_i) {
				var _row = {},
					isPush = false;
				for (var p in item_i) {
					//  p : excel 中头部名称
					//  item_i[p] 此行此名称下的值
					//  HeadOrder[p] excel 中头部名称 对应的实体属性名称
					if (!HeadOrder[p])
						continue;
					_row[HeadOrder[p]] = item_i[p];
					isPush = true;
				}
				if (isPush)
					result.push(_row);
			});

			return result;
		},

		showFilterSource: function ($tableBd, Title, FilterSource) {
			var _Index_tr = 0;
			$tableBd.children("tr").removeClass("tbody_tr_odd");
			$tableBd.children("tr").removeClass("tbody_tr_even");
			$tableBd.children("tr").each(function (i, item) {

				var $TitleNode = $(item).children('td[data-title=' + Title + ']');
				var _value = $TitleNode.attr("data-value");

				if (_value == undefined || _value.length < 1) {
					$(item).hide();
					return true;
				}


				var _index = util.findIndex(FilterSource, function (p) {
					return p[Title] == _value
				});
				if (_index < 0) {
					$(item).hide();
					return true;
				}
				$(item).show();
				if (_Index_tr % 2) {
					$(item).addClass("tbody_tr_even");
				} else {
					$(item).addClass("tbody_tr_odd");
				}
				_Index_tr++;
			});
		},

		filterByConndition: function ($tableBd, data_list, Conndition, Title) {
			tableTool.showFilterSource($tableBd, Title, tableTool.getFilterSource(data_list, Conndition));
		},
		getFilterSourceByLikeString: function (data_list, wLikeString, Formatter_Source, delimiter, not_union) {
			var isPush = false,
				_Source = [];

			if (!delimiter || delimiter.length < 1) {
				delimiter = "&&";
			}
			if (!wLikeString) {
				wLikeString = "";
			}

			var wLikeStringArray = wLikeString.split(delimiter);
			if (!not_union || not_union != 1) {
				not_union = false;
			} else {
				not_union = true;
			}

			$.each(data_list, function (i, item) {

				for (var i = 0; i < wLikeStringArray.length; i++) {
					isPush = false;
					for (var p in item) {
						if (item[p] == undefined)
							continue;


						if ((item[p] + "").indexOf(wLikeStringArray[i]) >= 0) {
							isPush = true;
							break;
						}
						if (Formatter_Source && Formatter_Source[p]) {
							if (("" + Formatter_Source[p](item[p])).indexOf(wLikeString) >= 0) {
								isPush = true;
								break;
							}
						}
					}
					if (not_union == isPush) {
						break;
					}
				}

				if (isPush) {
					_Source.push(item);
				}
			});
			return _Source;
		},

		filterByLikeString: function ($tableBd, data_list, wLikeString, Title, Formatter_Source, delimiter, not_union) {
			tableTool.showFilterSource($tableBd, Title, tableTool.getFilterSourceByLikeString(data_list, wLikeString, Formatter_Source, delimiter, not_union));
		}
	};


	var serviceCon = {
		server: '/MESCore',
		url: '/api',
		loginUrl: '/MESCore/api/HomePage/Index',
	};

	var global = {
		version: "v0.1.0",
		timeout: 60000
	};

	var cookie = {
		set: function (name, val, days) {
			var times = new Date(),
				expires = ";expires=";

			if (days) {
				times.setTime(times.getTime() + (60000 * 60 * 24 * days));
				expires += times.toGMTString();
			} else {
				expires += "";
			}

			document.cookie = name + "=" + val + expires;
		},

		//delete cookie
		del: function (name) {
			document.cookie = name + "=;expires=" + (new Date(0)).toGMTString() + "; path=/";
		},

		//get cookie
		get: function (name) {
			var arrCookie = document.cookie.split(";");
			for (var i = 0; i < arrCookie.length; i++) {
				var arr = arrCookie[i].replace(/(^\s+)|(\s+$)/g, "");
				arr = arr.split("=");
				if (arr[0] == name) {
					return arr.slice(1).join("=");
				}
			}
			return "";
		}
	};

	var math = {
		round: function (num, pow) {
			var BASE = Math.pow(10, pow || 4);
			return Math.round(num * BASE) / BASE;
		}
	}
	var app = {
		timeRule: function (time, now) {
			var date = now || (new Date()).getTime(),
				dif = date - time,
				t = "";
			console.log(dif);
			if (dif < 60000) {
				t = "1分钟前";
			} else if (dif < 60000 * 60) {
				t = Math.floor(dif / 60000) + "分钟前";
			} else if (dif < 60000 * 60 * 24) {
				t = Math.floor(dif / (60000 * 60)) + "小时前";
			} else if (dif < 60000 * 60 * 24 * 2) {
				t = "昨天";
			} else {
				t = util.format("MM-dd hh:mm", time);
			}

			return t;
		},

		percentColor: function (num) {
			var color = "#000";
			if (num < 33.3) {
				color = "#ea0909";
			} else if (num < 66.6) {
				color = "#ea9809";
			} else {
				color = "#77ac19";
			}

			return "<em style='font-style:normal;color:" + color + "'>" + num + "%</em>";
		},

		// code process
		processCode: function (code, msg) {

			var codeSet = {
				9999: '服务器繁忙,请稍后再试',
				9998: "您还没登录",
				9997: "已有账号登录，请将已登录账号退出或关闭浏览器后再试！",
				9996: "添加失败",
				9995: "配置参数不合法",
				9994: "您没有权限！",
				1001: "请输入账号",
				1002: "请输入密码",
				1003: "当前权限等级不够，无法操作",
				1004: "密码不合法",
				1005: "账号或密码错误",
				1006: "密码修改失败",
				1007: "无效账号",
				1008: "账号删除失败",
				1009: "无法删除登录账号",
				1010: "账号信息更新失败",
				2001: "请输入账号",
				2002: "请输入密码",
				2003: "请选择管理权限",
				2004: "账号添加失败",
				2005: "该账号已经存在",
				2006: "账号信息更新失败",
				2007: "账号信息查询失败",
				5001: "请输入服务名称",
				5002: "请输入版本号",
				5003: "服务删除失败",
				6001: "请输入IP地址",
				6002: "请输入密码",
				6003: "Conserver删除失败",
				7001: "请给架构起个可爱的名字",
				7002: "请选择架构类型",
				7003: "架构删除失败，请重试",
				7004: "架构启用失败",
				7005: "架构停用失败",
				7006: "同时只能启用一个架构，如要启用该架构请先停止其他在用架构",
				7007: "请先停止再进行删除操作",
				8008: "请添加服务器",
				8010: "监控出错",
				9001: "组删除失败",
				4047: "该帐号已在别处登录，3秒后将自动退出"
			};
			app.loaded();
			switch (code) {
				case 9998:
					app.removeInfo();

					if (window.parent && window.parent.document.getElementsByName("iframeContain")[0])
						window.parent.location.href = serviceCon.loginUrl;
					else
						window.location.href = serviceCon.loginUrl;
					break;

				default:
					app.tip(msg || codeSet[code] || code + '未知错误类型，请补充！');
			}
		},

		tip: function (content, fn) {
			alert(content);
			fn && fn();
		},

		/**
		 * 高亮 就是字体变红色？？？
		 */
		highlight: function (val, temp) {

			temp = temp || '';
			if (val !== '' && val != null && val != undefined) {
				temp = temp.replace(new RegExp(val, 'g'), function () {
					return "<span style='color:red;'>" + val + "</span>";
				});
			}

			return temp;
		},

		/**
		 * 得重写这个load等待函数 用动画
		 */
		loading: function (content) {

			var _html = [
				'<div  class="femi-modal femi-loading"  >',
				'<div></div>',
				'<p>{{content}}</p>',
				'</div>',
				'<div class="femi-modal-backdrop in femi-loading"  ></div>'
			].join('');

			if ($('.femi-loading').length > 0) {
				$('.femi-loading').remove();
			}
			$('body').append(util.template({
				content: content || 'loading...'
			}, _html));

		},

		loaded: function () {
			if ($('.femi-loading').length > 0) {
				$('.femi-loading').remove();
			}
		},
		ajax_file: function (data, fn, err, context) {
			var suc,
				fail,
				__EMPTY = function () { },
				_ajax,
				URI,
				TYPE,
				DATATYPE,
				SERVER;
			if (arguments.length < 4) {
				context = err;
				err = __EMPTY;
			}
			if (util.isArray(fn)) {
				suc = fn[0];
				fail = fn[1] || __EMPTY;
			} else {
				suc = fn;
				fail = __EMPTY;
			}

			URI = data.$URI || '';
			TYPE = data.$TYPE || 'get';
			DATATYPE = data.$DATATYPE || 'JSON';
			SERVER = data.$SERVER || serviceCon.server;
			delete data.$URI;
			delete data.$TYPE;
			delete data.$DATATYPE;
			delete data.$SERVER;

			var _Retrun = false;
			_ajax = $.ajax({
				url: DATATYPE.toLowerCase() === "json" ? SERVER + serviceCon.url + URI : URI,
				type: TYPE,
				contentType: false,
				processData: false,
				data: data.form,
				dataType: TYPE.toLowerCase() === 'get' ? DATATYPE : 'JSON',
				timeout: global.timeout,
				success: function (res) {
					if (_Retrun)
						return;
					_Retrun = true;
					if (res.resultCode === 1000) {
						suc && suc.call(context || null, res.returnObject);
					} else {
						app.processCode(res.resultCode, res.returnObject.msg || "");
						fail && fail.call(context || null, res.returnObject);
					}
				},
				error: err,
				crossDomain: DATATYPE.toLowerCase() === "json" ? false : true,
			});
			if (DATATYPE.toLowerCase() === 'json') {
				_ajax.then(function (res) {
					if (_Retrun)
						return;
					_Retrun = true;

					if (res.resultCode === 1000) {
						suc && suc.call(context || null, res.returnObject);
					} else {
						app.processCode(res.resultCode, res.returnObject.msg || "");
						fail && fail.call(context || null, res.returnObject);
					}
				}, err);
			}
			return _ajax;
		},
		ajax: function (data, fn, err, context) {
			var suc,
				fail,
				__EMPTY = function () { },
				_ajax,
				URI,
				TYPE,
				DATATYPE,
				SERVER;
			if (arguments.length < 4) {
				context = err;
				err = __EMPTY;
			}
			if (util.isArray(fn)) {
				suc = fn[0];
				fail = fn[1] || __EMPTY;
			} else {
				suc = fn;
				fail = __EMPTY;
			}

			URI = data.$URI || '';
			TYPE = data.$TYPE || 'get';
			DATATYPE = data.$DATATYPE || 'JSON';
			SERVER = data.$SERVER || serviceCon.server;
			delete data.$URI;
			delete data.$TYPE;
			delete data.$DATATYPE;
			delete data.$SERVER;

			var _Retrun = false;

			if (!window.login_status) {
				var query = uri.getUrlQuery(window.location.hash.split('?')[1] || "");

				if (query.cadv_ao && query.cadv_ao.length > 0 && query.cade_po && query.cade_po.length > 0) {
					var _index = URI.indexOf("?");
					if (_index > 0) {
						URI = URI.slice(0, _index + 1) + "cadv_ao=" + query.cadv_ao + "&cade_po=" + query.cade_po + "&" + URI.slice(_index + 1);
					} else {
						URI = URI + "?cadv_ao=" + query.cadv_ao + "&cade_po=" + query.cade_po;
					}
				}
			}

			_ajax = $.ajax({
				url: DATATYPE.toLowerCase() === "json" ? SERVER + serviceCon.url + URI : URI,
				type: TYPE,
				contentType: 'application/json;charset=utf-8',
				data: TYPE.toLowerCase() === 'get' ? data : util.stringify(data),
				dataType: TYPE.toLowerCase() === 'get' ? DATATYPE : 'JSON',
				timeout: global.timeout,
				success: function (res) {
					if (_Retrun)
						return;
					_Retrun = true;
					if (res.resultCode === 1000) {
						suc && suc.call(context || null, res.returnObject);
					} else {
						app.processCode(res.resultCode, res.returnObject.msg || "");
						fail && fail.call(context || null, res.returnObject);
					}
				},
				error: err,
				crossDomain: DATATYPE.toLowerCase() === "json" ? false : true,
			});
			if (DATATYPE.toLowerCase() === 'json') {
				_ajax.then(function (res) {
					if (_Retrun)
						return;
					_Retrun = true;

					if (res.resultCode === 1000) {
						suc && suc.call(context || null, res.returnObject);
					} else {
						app.processCode(res.resultCode, res.returnObject.msg || "");
						fail && fail.call(context || null, res.returnObject);
					}
				}, err);
			}
			return _ajax;
		},


		ajax_load: function (form, fn, err, context) {
			var suc,
				fail,
				__EMPTY = function () { },
				_ajax,
				URI,
				TYPE,
				SERVER;
			if (arguments.length < 4) {
				context = err;
				err = __EMPTY;
			}
			if (util.isArray(fn)) {
				suc = fn[0];
				fail = fn[1] || __EMPTY;
			} else {
				suc = fn;
				fail = __EMPTY;
			}

			URI = form.$URI || "";
			TYPE = form.$TYPE || 'get';
			SERVER = form.$SERVER || serviceCon.server;

			delete form.$URI;
			delete form.$TYPE;
			delete form.$SERVER;

			_ajax = $.ajax({
				url: SERVER + serviceCon.url + URI,
				type: "POST",
				data: form,
				contentType: false,
				processData: false,
				dataType: 'JSON',
			});

			_ajax.done(function (res) {
				if (res.resultCode === 1000) {
					suc && suc.call(context || null, res.returnObject);
				} else {
					app.processCode(res.resultCode, res.returnObject.msg || "");
					fail && fail.call(context || null, res.returnObject);
				}
			});

			return _ajax;
		},


		//APP
		setImage: function (node, url) {
			var limitWidth = 225,
				limitHeight = 150;
			/* 2013-1-10 TD BUG 301 修改 */
			function getImgSize(config) {
				var lWidth = config.limitWidth || limitWidth,
					lHeight = config.limitHeight || limitHeight,
					rWidth = width = config.width,
					rHeight = height = config.height,
					scale;

				// lh 150 lw 225 h503 w333
				if ((height > width) || (height == width && lHeight > lWidth)) {
					scale = lHeight / height;
					if (scale < 1) {
						rHeight = lHeight;
						rWidth = scale * width;
					}
				} else if ((height < width) || (height == width && lHeight <= lWidth)) {
					scale = lWidth / width;
					if (scale < 1) {
						rHeight = scale * height;
						rWidth = lWidth;
					}
				}
				return {
					width: rWidth,
					height: rHeight
				};
			}

			(function (fileUrl) {
				var notIe = $.browser.msie,
					size,
					imgWidth,
					imgHeight,
					imgs = new Image();
				imgs.src = fileUrl + '?' + Math.random();
				imgs.onload = imgs.onreadystatechange = function () {
					if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
						var img = document.createElement("img");
						$(img).attr("src", fileUrl);
						node.html(img);
						imgWidth = this.width;
						imgHeight = this.height;
						size = getImgSize({
							width: imgWidth,
							height: imgHeight
						});
						img.width = size.width;
						img.height = size.height;
					}
				};
			}(url));
		},

		removeInfo: function () {
			cookie.del('__k_user_id_');
			cookie.del('__k_company_id_');
			cookie.del('__k_person_judge_');
		},

		/**
		 * 将滚动条移动到num处  只上移不下移 
		 */
		scrollTop: function (num) {
			var cTop = $(document).scrollTop();

			if (cTop > num) {
				$(document).scrollTop(num);
			}
		},
	};


	var util = (function () {
		var AP = Array.prototype,
			OP = Object.prototype,
			APS = Array.prototype.slice;

		//空方法
		function _EMPTY() {
		}
		//颜色转换
		function RgbToH(color) {
			if (!color && color == '') {
				return '';
			}
			var values = color
				.replace(/rgba?\(/, '')
				.replace(/\)/, '')
				.replace(/[\s+]/g, '')
				.split(',');
			var a = parseFloat(values[3] || 1),
				r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
				g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
				b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
			return "#" +
				("0" + r.toString(16)).slice(-2) +
				("0" + g.toString(16)).slice(-2) +
				("0" + b.toString(16)).slice(-2);
		}
		//反柯理化
		Function.prototype.uncurring = function () {
			var __this = this;
			return function () {
				return Function.prototype.call.apply(__this, arguments);
			};
		};

		function each(data, fn) {
			var cb = fn || function () { };
			if (data.length) {
				for (var i = 0, len = data.length; i < len; i++) {
					if (cb(data[i], i, data) === false) {
						return false;
					}
				}
			} else {
				var i = 0;
				for (var obj in data) {
					var item = {
						Key: obj,
						Value: data[obj]
					};
					if (cb(item, i, data) === false) {
						return false;
					}
					i++;
				}
			}

		}

		function assign(o1, o2) {
			for (var k in o2) {
				if (o2.hasOwnProperty(k)) {
					o1[k] = o2[k];
				}
			}
			return o1;
		}

		var typeStr = OP.toString.uncurring(),
			util = {};

		each("Array,Object,String,Function,Date,RegExp,Boolean,Number".split(","), function (type) {
			util['is' + type] = function (s) {
				return typeStr(s) === '[object ' + type + ']';
			};
		});
		function GetExplorer() {
			var explorer = window.navigator.userAgent;
			//ie 
			if (explorer.indexOf("MSIE") >= 0) {
				return 'ie';
			}
			//firefox 
			else if (explorer.indexOf("Firefox") >= 0) {
				return 'Firefox';
			}
			//Chrome
			else if (explorer.indexOf("Chrome") >= 0) {
				return 'Chrome';
			}
			//Opera
			else if (explorer.indexOf("Opera") >= 0) {
				return 'Opera';
			}
			//Safari
			else if (explorer.indexOf("Safari") >= 0) {
				return 'Safari';
			}
		}

		// JSON
		function stringify(O) {
			if (window.JSON && JSON.stringify)
				return JSON.stringify(O);

			var S = [],
				J = "";
			if (util.isArray(O)) {
				for (var i = 0; i < O.length; i++)
					S.push(stringify(O[i]));
				J = '[' + S.join(',') + ']';
			} else if (util.isDate(O)) {
				J = "new Date(" + O.getTime() + ")";
			} else if (util.isRegexp(O) || util.isFunction(O)) {
				J = O.toString();
			} else if (util.isObject(O)) {
				for (var i in O) {
					O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? stringify(O[i]) : O[i]);
					S.push(i + ':' + O[i]);
				}
				J = '{' + S.join(',') + '}';
			}
			return J;
		}
		function JSONparse(str) {
			try {
				if (str === "") {
					return [];
				}
				if (window.JSON && JSON.parse) {
					return JSON.parse(str);
				} else {
					return eval("(" + str + ")");
				}
			} catch (e) {
				throw new Error('not valid string');
			}
		}

		return assign(util, {
			boolean: function (str) {
				if (str === "true" || str === true) {
					return true;
				} else if (str === "false" || str === false) {
					return false;
				} else {
					return undefined;
				}
			},

			each: each,

			trim: function (s) {
				return s.replace(/(^\s*)|(\s*$)/g, '');
			},

			indexOf: function (ret, val) {
				for (var i = 0, len = ret.length; i < len; i++) {
					if (ret[i] == val) {
						return i;
					}
				}
				return -1;
			},

			find: function (array, fn) {
				for (var p = 0; p < array.length; p++) {
					if (fn(array[p], p, array))
						return array[p];
				}
				return undefined;
			},
			findIndex: function (array, fn) {
				for (var p = 0; p < array.length; p++) {
					if (fn(array[p], p, array))
						return p;
				}
				return -1;
			},
			findAll: function (array, fn) {
				var _array = [];
				for (var p = 0; p < array.length; p++) {
					if (fn(array[p], p, array))
						_array.push(array[p]);
				}
				return _array;
			},
			deleteLowerProperty: function (data) {
				if (!util.isArray(data)) {
					data = [data];
				}
				$.each(data, function (i, item) {
					if (item instanceof Object) {
						var d_p = [];
						for (var p in item) {
							if (!util.CheckFirstUpper(p)) {
								d_p.push(p)
								continue;
							}

							util.deleteLowerProperty(item[p]);
						}
						for (var i = 0; i < d_p.length; i++) {
							delete item[d_p[i]];
						}
					}
				})

			},
			CheckFirstUpper: function (name) {
				var reg = /^[A-Z0-9][A-Za-z0-9_]*$/;
				return reg.test(name);
			},

			//模版生成
			template: function (d, h) {

				var str = '';

				if (!util.isArray(d)) {
					d = [d];
				}

				if (!h) {
					throw new Error('cann\'t find template string!');
				}

				if (!d.length)
					return str;

				each(d, function (l, i) {

					str += h.replace(/\{\{\s*([a-zA-Z0-9\_\.\-\|\s]+)\s*\}\}/igm, function ($1, $2) {
						var ret,
							value,
							tv;

						if ($2.indexOf('||') > -1) {
							ret = $2.split('||');
						} else {
							ret = [$2];
						}

						// 命令检测
						// 根据优先级执行相应命令
						// 检测最终数据

						for (var i = 0, len = ret.length; i < len; i++) {
							tv = l[util.trim(ret[i])];
							if (tv !== '' && tv != undefined && tv != null) {
								return tv;
							}
						}
						return '';
					});
				});

				return str;
			},
			//渲染模板
			randerTemplateZace: function (arry) {
				//var str = "<tr data-color=\"\"><td style=\"min-width: 3px\"><input type=\"checkbox\"class=\"femi-tb-checkbox\" style=\"margin: 1px 0px 1px\"value=\"{{functionID}}\" /></td>";
				var str = "<tr data-color=\"\" style=\"background-color:{{Color}}\">";
				if (!util.isArray(arry)) {
					return;
				} else {
					$.each(arry, function (i, item) {
						str += "<td style=\"min-width: 50px\" data-title=\"" + item + "\" " + "data-value=\"" + "{{" + item + "}}\"" + " " + ">" + "{{" + item + "}}" + "</td>";
					});
				}
				str += "</tr>";
				return str;
			},
			//渲染模板
			randerTemplate: function (arry) {
				var str = "<tr data-color=\"\"><td style=\"min-width: 3px\"><input type=\"checkbox\"class=\"femi-tb-checkbox\" style=\"margin: 1px 0px 1px\"value=\"{{functionID}}\" /></td>";
				if (!util.isArray(arry)) {
					return;
				} else {
					$.each(arry, function (i, item) {
						str += "<td style=\"min-width: 50px\" data-title=\"" + item + "\" " + "data-value=\"" + "{{" + item + "}}\"" + " " + ">" + "{{" + item + "}}" + "</td>";
					});
				}
				str += "</tr>";
				return str;
			},

			//颜色转换
			RgbToH: RgbToH,

			//JSON to string
			stringify: stringify,

			parse: JSONparse,

			Clone: function (_in_Data) {
				return util.parse(util.stringify(_in_Data));
			},

			formatZZZ: function (format, time) {
				var o,
					now;

				if (time) {
					if (time instanceof Date) {
						now = time;
					} else if (time && util.isString(time)) {

						if (time.indexOf("T") > 0) {
							now = new Date(time);
						} else {
							now = new Date(time.replace(/-/g, "/"));
						}

					} else if (isNaN(time)) {
						now = new Date(time);
					} else {
						now = new Date(Number(time));
					}
				} else {
					now = new Date();
				}



				o = {
					"M+": now.getMonth() + 1, //month
					"d+": now.getDate(), //day
					"h+": now.getHours(), //hour
					"H+": now.getHours(), //hour
					"m+": now.getMinutes(), //minute
					"s+": now.getSeconds(), //second
					"q+": Math.floor((now.getMonth() + 3) / 3), //quarter
					"S": now.getMilliseconds() //millisecond
				};

				/*if (now < new Date("2000-01-01"))
							o["h+"] -= 8;*/
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
				}

				for (var k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				return format;
			},
			toDate: function (time) {

				var now = new Date();
				if (time) {
					if (time instanceof Date) {
						now = time;
					} else if (time && util.isString(time)) {


						if (time.indexOf("T") > 0) {
							var a = time.split(/[^0-9]/);
							// now = new Date(parseInt(a[0]), parseInt(a[1]) - 1, parseInt(a[2]),
							// 	parseInt(a[3]), parseInt(a[4]), parseInt(a[5]));
							now =new Date(Date.UTC(parseInt(a[0]),parseInt(a[1]) - 1,parseInt(a[2]),
                parseInt(a[3]),parseInt(a[4]), parseInt(a[5]),0));
						} else {
							now = new Date(time.replace(/-/g, "/"));
						}

					} else if (isNaN(time)) {
						now = new Date(time);
					} else {
						now = new Date(Number(time));
					}
				}
				return now;
			},
			format: function (format, time) {
				var o,
					now;
				if (time) {
					if (time instanceof Date) {

						now = time;
					} else if (time && util.isString(time)) {

						// if (time.indexOf("T") > 0) {
						// 	now = new Date(time);
						// } else {
						// 	now = new Date(time.replace(/-/g, "/"));
						// }


						if (time.indexOf("T") > 0) {
							var a = time.split(/[^0-9]/);
							//alert(a);
							//alert(a[0]+' '+ a[1] - 1+' '+ a[2]+' '+a[3]+' '+a[4]+' '+ a[5]);
							now =new Date(Date.UTC(parseInt(a[0]),parseInt(a[1]) - 1,parseInt(a[2]),
                parseInt(a[3]),parseInt(a[4]), parseInt(a[5]),0));
						} else {
							now = new Date(time.replace(/-/g, "/"));
						}

					} else if (isNaN(time)) {
						now = new Date(time);
					} else {
						now = new Date(Number(time));
					}
				} else {
					now = new Date();
				}



				o = {
					"M+": now.getMonth() + 1, //month
					"d+": now.getDate(), //day
					"h+": now.getHours(), //hour
					"m+": now.getMinutes(), //minute
					"s+": now.getSeconds(), //second
					"q+": Math.floor((now.getMonth() + 3) / 3), //quarter  季度
					"S": now.getMilliseconds() //millisecond
				};

				/*if (now < new Date("2000-01-01"))
							o["h+"] -= 8;*/
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
				}

				for (var k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				return format;
			},

			/*
				 * 获取命名空间
				 * @method getNamespace 获取命名空间对象
				 * @param {object} ns 命名空间起点对象
				 * @param {string} sns 空间字符串
				 * @returns 返回命名空间内容
				 */
			getNamespace: function (ns, sns) {
				var root = ns,
					ret = util.isArray(sns) ? sns : sns.split('.');

				try {
					//获取服务类型
					for (var i = 0, len = ret.length; i < len; i++) {
						root = root[ret[i]];
					}
				} catch (e) {
					root = ns;
				}

				return root;
			},

			reverse: function (obj) {
				var _obj = {};
				for (var p in obj) {
					if (obj.hasOwnProperty(p)) {
						_obj[obj[p]] = p;
					}
				}

				return _obj;
			},
			getExplorer: GetExplorer,
			exportJsonExcel: function (JSONData, FileName, ShowFileds) {
				var arrData = typeof JSONData != 'object' ? JSONparse(JSONData) : JSONData;

				var excel = '<table>';

				if (!arrData || !arrData.length) {
					alert("导出数据不能为空！");
					return;
				}
				var _keys = Object.keys(arrData[0]);

				if (!ShowFileds || $.isEmptyObject(ShowFileds)) {
					ShowFileds = {};
					for (var i = 0; i < _keys.length; i++) {
						ShowFileds[_keys[i]] = {
							index: i,
							name: _keys[i]
						};
					}
				}
				if (!ShowFileds || $.isEmptyObject(ShowFileds)) {
					alert("导出数据字段不能为空！");
					return;
				}
				//设置表头  
				var row = "<tr>";

				for (var p in ShowFileds) {
					row += "<th>" + ShowFileds[p].name + '</th>';
				}

				//换行   
				excel += row + "</tr>";

				//设置数据  
				for (var i = 0; i < arrData.length; i++) {
					var row = "<tr>";

					for (var p in ShowFileds) {
						var value = arrData[i][p] === "." ? "" : arrData[i][p];
						row += '<td>' + value + '</td>';
					}
					excel += row + "</tr>";
				}
				excel += "</table>";

				var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
				excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
				excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
				excelFile += '; charset=UTF-8">';
				excelFile += "<head>";
				excelFile += "<!--[if gte mso 9]>";
				excelFile += "<xml>";
				excelFile += "<x:ExcelWorkbook>";
				excelFile += "<x:ExcelWorksheets>";
				excelFile += "<x:ExcelWorksheet>";
				excelFile += "<x:Name>";
				excelFile += "{worksheet}";
				excelFile += "</x:Name>";
				excelFile += "<x:WorksheetOptions>";
				excelFile += "<x:DisplayGridlines/>";
				excelFile += "</x:WorksheetOptions>";
				excelFile += "</x:ExcelWorksheet>";
				excelFile += "</x:ExcelWorksheets>";
				excelFile += "</x:ExcelWorkbook>";
				excelFile += "</xml>";
				excelFile += "<![endif]-->";
				excelFile += "</head>";
				excelFile += "<body>";
				excelFile += excel;
				excelFile += "</body>";
				excelFile += "</html>";
				var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

				var link = document.createElement("a");
				link.href = uri;

				link.style = "visibility:hidden";
				link.download = FileName + ".xls";

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);


			},
			exportTableExcel: function (TableID, FileName) {
				var idTmr;

				(function Start(tableid, tableName) { //整个表格拷贝到EXCEL中
					if (GetExplorer() == 'ie') {
						var curTbl = document.getElementById(tableid);
						var oXL = new ActiveXObject("Excel.Application");

						//创建AX对象excel 
						var oWB = oXL.Workbooks.Add();

						//获取workbook对象 
						var xlsheet = oWB.Worksheets(1);

						//激活当前sheet 
						var sel = document.body.createTextRange();
						sel.moveToElementText(curTbl.parentNode);
						//把表格中的内容移到TextRange中 
						sel.select();
						//全选TextRange中内容 
						sel.execCommand("Copy");
						//复制TextRange中内容  
						xlsheet.Paste();
						//粘贴到活动的EXCEL中       
						oXL.Visible = true;
						//设置excel可见属性

						try {
							var fname = oXL.Application.GetSaveAsFilename(tableName + ".xls", "Excel Spreadsheets (*.xls), *.xls");
						} catch (e) {
							print("Nested catch caught " + e);
						} finally {
							oWB.SaveAs(fname);

							oWB.Close(savechanges = false);
							//xls.visible = false;
							oXL.Quit();
							oXL = null;
							//结束excel进程，退出完成
							//window.setInterval("Cleanup();",1);
							idTmr = window.setInterval("Cleanup();", 1);

						}

					} else {
						tableToExcel(tableid, tableName);
					}
				})(TableID, FileName);
				function Cleanup() {
					window.clearInterval(idTmr);
					CollectGarbage();
				}

				var tableToExcel = (function () {
					var uri = 'data:application/vnd.ms-excel;base64,',
						template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"'
							+ 'xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]>'
							+ '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name>'
							+ '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>'
							+ '<![endif]--></head><body><table>{table}</table></body></html>',
						base64 = function (s) {
							return window.btoa(unescape(encodeURIComponent(s)))
						},
						format = function (s, c) {
							return s.replace(/{(\w+)}/g,
								function (m, p) {
									return c[p];
								}
							);
						}
					return function (table, name) {
						if (!table.nodeType)
							table = document.getElementById(table)
						var ctx = {
							worksheet: name || 'Worksheet',
							table: table.innerHTML
						}

						var link = document.createElement("a");
						link.href = uri + base64(format(template, ctx));

						link.style = "visibility:hidden";
						link.download = FileName + ".xls";

						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}
				})();
			},

			importExcel: function (filePath, ShowFileds) {
				var _rst = [];
				if (GetExplorer() != "ie") {
					alert("此功能只能在IE浏览器下使用！");
					return _rst;
				}

				var _Fileds = {};
				for (var _name in ShowFileds) {
					_Fileds[ShowFileds[_name].name] = _name;
				}
				//创建操作EXCEL应用程序的实例  
				var oXL = new ActiveXObject("Excel.application");
				//打开指定路径的excel文件  
				var oWB = oXL.Workbooks.open(filePath);
				//操作第一个sheet(从一开始，而非零)  
				oWB.worksheets(1).select();
				var oSheet = oWB.ActiveSheet;
				//使用的行数  
				var rows = oSheet.usedrange.rows.count;
				var columns = oSheet.usedrange.columns.count;



				try {
					var tempStr = '[';
					for (var i = 0; i < rows; i++) {
						tempStr += '[';
						for (var j = 0; j < columns; j++) {
							tempStr += '"';
							if ((oSheet.Cells(i + 1, j + 1) + "") != "undefined") {
								tempStr += (oSheet.Cells(i + 1, j + 1) + "");
							} else {
								tempStr += ("{-}");
							}
							tempStr += '"';
							if (columns != (j + 1)) {
								tempStr += ',';
							}
						}
						if (rows != i + 1)
							tempStr += '],';
						else
							tempStr += ']';
					}
					tempStr += ']';
					var _excelData = JSONparse(tempStr)

					if (_excelData && util.isArray(_excelData) && _excelData.length > 1) {
						var _titles = _excelData[0].split(",");

						for (var sj = 0; sj < _titles.length; sj++) {
							_titles[sj] = _Fileds[_titles[sj]];
						}

						for (var m = 1; m < _excelData.length; m++) {
							var _datail = _excelData[m].split(",");
							var setItem = {};
							for (var si = 0; si < _titles.length; si++) {
								setItem[_titles[si]] = _datail[si];
							}
							_rst.push(setItem);
						}
					}


				} catch (e) {
					console.log(e);
				} finally {
					//退出操作excel的实例对象  
					oXL.Application.Quit();
					//手动调用垃圾收集器  
					CollectGarbage();

				}
				return _rst;
			},
			importExcelBySql: function (filePath, ShowFileds, _SheetName) {
				var _rst = [];
				var _Fileds = {};
				for (var _name in ShowFileds) {
					_Fileds[ShowFileds[_name].name] = _name;
				}
				var _data = (function importXLS(fileName, SheetName) {
					var rsExcel = null;
					var _rst = [];
					var objCon = new ActiveXObject("ADODB.Connection");
					objCon.Provider = "Microsoft.Jet.OLEDB.4.0";
					objCon.ConnectionString = "Data Source=" + fileName + ";Extended Properties=Excel 8.0;";
					objCon.CursorLocation = 1;
					objCon.Open;
					var strQuery;
					//Get the SheetName
					var strSheetName = SheetName ? SheetName : "Sheet1";
					var rsTemp = new ActiveXObject("ADODB.Recordset");
					rsTemp = objCon.OpenSchema(20);
					if (!rsTemp.EOF)
						strSheetName = rsTemp.Fields("Table_Name").Value;
					rsTemp = null;
					rsExcel = new ActiveXObject("ADODB.Recordset");
					strQuery = "SELECT * FROM [" + strSheetName + "$]";
					rsExcel.ActiveConnection = objCon;
					rsExcel.Open(strQuery);
					while (!rsExcel.EOF) {
						var tempItem = [];
						for (var i = 0; i < rsExcel.Fields.Count; ++i) {
							tempItem[i] = rsExcel.Fields(i).value;
							//alert(rsExcel.Fields(i).value);
						}
						_rst.push(tempItem);
						rsExcel.MoveNext;
					}
					// Close the connection and dispose the file
					objCon.Close;
					objCon = null;
					rsExcel = null;


					return _rst;
				})(filePath, _SheetName);
				var _titles = _data[0];

				for (var sj = 0; sj < _titles.length; sj++) {
					_titles[sj] = _Fileds[_titles[sj]];
				}

				for (var m = 1; m < _data.length; m++) {
					var _datail = _data[m];
					var setItem = {};
					for (var si = 0; si < _titles.length; si++) {
						setItem[_titles[si]] = _datail[si];
					}
					_rst.push(setItem);
				}
				return _rst;
			},


			formatter: (function () {
				return {
					DateTime: function (value, row, index) {
						var html = (util.format("yyyy-MM-dd hh:mm:ss", value));
						return html;
					},
					Time: function (value, row, index) {
						var html = (util.format("hh:mm:ss", value));
						return html;
					},
					Date: function (value, row, index) {
						var html = (util.format("yyyy-MM-dd", value));
						return html;
					},

					Bool: function (value, row, index) {
						var html = ((value == true || value == "true") ? "是" : "否");
						return html;
					},
					LongText: function (value, row, index) {
						var html = value;
						return html;
					},
					IP: function (value, row, index) {
						if (isNaN(value))
							return value;
						var html = ((value >> 24) & 0xFF) + "." + ((value >> 16) & 0xFF) + "." + ((value >> 8) & 0xFF) + "." + ((value) & 0xFF);
						return html;
					},
					Percent: function (value, row, index) {
						if (isNaN(value))
							return value;
						var html = (value * 100) + "%";
						return html;
					},
					InputArray: function (value, row, index) {
						if (!util.isArray(value))
							value = [value];
						var html = value.join(" |,| ");
						return html;
					}
				};
			})(),
			getFormatter: function (TypeSource, prop, type) {

				var fn = util.formatter[type];
				if (fn)
					return fn;

				return function (value, row, index) {
					var d_array = [];
					$.each(TypeSource[prop], function (d_i, d_item) {
						if (value instanceof Array) {
							if ($.inArray(d_item.value, value) < 0) {
								return true;
							}
							d_array.push(d_item.name);
						}

						if (value == d_item.value) {
							value = [value];
							d_array = [d_item.name];
							return false;
						}
					});

					var html = (d_array.join(","));
					return html;
				};
			},

			fontsizeChange: function (_inSize) {
				if ((_inSize && !isNaN(_inSize)) || _inSize == 0) {
					if (window.parent) {
						window.parent.femi_size = Number(_inSize);
					} else {
						window.femi_size = Number(_inSize);
					}
				}
				var _size = (window.parent && window.parent.femi_size)
					? window.parent.femi_size : (window.femi_size ? window.femi_size : 0);

				$('body').css("font-size", (12 + _size) + 'px');
				$('.femi-font-size-large').css("font-size", (14 + _size) + 'px');
				$('.femi-font-size-biglarge').css("font-size", (16 + _size) + 'px');
				$('.femi-font-size-middle').css("font-size", (12 + _size) + 'px');
				$('.femi-font-size-small').css("font-size", (10 + _size) + 'px');
				$('.femi-font-size-little').css("font-size", (8 + _size) + 'px');

				if (window.parent) {
					$('body', window.parent.document).css("font-size", (12 + _size) + 'px');
					$('.femi-font-size-large', window.parent.document).css("font-size", (14 + _size) + 'px');
					$('.femi-font-size-biglarge', window.parent.document).css("font-size", (16 + _size) + 'px');
					$('.femi-font-size-middle', window.parent.document).css("font-size", (12 + _size) + 'px');
					$('.femi-font-size-small', window.parent.document).css("font-size", (10 + _size) + 'px');
					$('.femi-font-size-little', window.parent.document).css("font-size", (8 + _size) + 'px');
				}
				if (window.frames && window.frames.length > 0) {
					for (var i = 0; i < window.frames.length; i++) {

						$(window.frames[i].document).find('body').css("font-size", (12 + _size) + 'px');
						$(window.frames[i].document).find('.femi-font-size-large').css("font-size", (14 + _size) + 'px');
						$(window.frames[i].document).find('.femi-font-size-biglarge').css("font-size", (16 + _size) + 'px');
						$(window.frames[i].document).find('.femi-font-size-middle').css("font-size", (12 + _size) + 'px');
						$(window.frames[i].document).find('.femi-font-size-small').css("font-size", (10 + _size) + 'px');
						$(window.frames[i].document).find('.femi-font-size-little').css("font-size", (8 + _size) + 'px');
					}
				}


			},

			// 属性筛选器   用于多级控制（级联填写）
			// name:属性名称  value:属性值
			// Data 被筛选对象数组
			// 返回筛选出的对象数组
			propertyFilter: function (Data, name, value) {
				var list = [];

				if (!Data || Data.length < 1)
					return list;

				if (Data[0][name] == undefined) {
					alert("数据中没有" + name + "属性");
					return false;
				}
				if (!value) {
					alert("请按照顺序依次选择数据");
				}

				for (var i = 0; i < Data.length; i++) {
					if (Data[i][name] == value) {
						list.push(Data[i]);
					}
				}
				return list;
			},
		});


	})();

	var uri = {
		/*
		 * 获取URL查询参数，组装成对象返回
		 * @method getUrlQuery 获取查询参数
		 * @returns {object} 返回组装后对象
		 */
		getUrlQuery: function (str) {

			var search = str || window.location.search;

			if (search === '') return {};

			var str = search.charAt(0) === '?' ? search.substring(1) : search,
				temp = str.split('&'),
				ret = {};

			//生成对象
			for (var i = 0, len = temp.length; i < len; i++) {

				var arg = temp[i].split('=');
				var key = arg[0];
				var value = arg.slice(1).join("=");
				ret[key] = decodeURIComponent(value);
			}

			return ret;
		},

		/*
		 * 组装url地址
		 * @method setUrlQuery 获取查询参数
		 * @param {object} o 需要转化的对象
		 * @returns {string} 返回组装后对象
		 */
		setUrlQuery: function (o) {
			var str = '';

			if (Object.prototype.toString(o) !== "[object Object]") {
				return '';
			}

			for (var x in o) {
				if (o.hasOwnProperty(x)) {
					str = str + x + '=' + String(o[x] == null || o[x] == undefined ? '' : o[x]) + '&';
				}
			}

			str = str.substring(0, str.length - 1);

			return encodeURI(str);
		}
	};

	var module = (function () {
		var events,
			baseComponent,
			Model;

		/*
		 * initialization event
		 */
		events = {
			core: function () {
				var self = this;
				this.query = uri.getUrlQuery(window.location.hash.split('?')[1] || "");
				this.field = uri.getUrlQuery();
				this.parent = $(this.selector ? "." + this.selector : "body");
				this.$ = function (selector) {
					return self.parent.find(selector);
				};
				this.configure();
				this.events();
				this.setTitle();
			}
		};

		/*
		 * base component
		 */
		baseComponent = {
			init: function (func) {
				var type = this.type ? this.type : "core",
					ev = type in events ? events[type] : event.core;

				ev.call(this);
				func && func();
				return this;
			},

			setTitle: function () {
				if (this.name && util.isString(this.name)) {
					window.document.title = this.name;
				}

				return this;
			},

			configure: function () { }
		};

		/*
		 * model entity
		 */
		Model = {
			create: function (component) {
				function Klass() {
				}
				$.extend(Klass.prototype, baseComponent, component);
				return new Klass();
			},
			/*
				 * @typename name[:extendName]
				 */
			expand: function (typename, func) {
				var kernel = typename.split(":"),
					type = kernel[0],
					base = kernel[1] ? kernel[1] in events ? kernel[1] : "core" : "core";

				if (!func) {
					throw new Error("func isn\'t function");
				}

				if (type === "core") {
					throw new Error("core is reserve keyword");
				}

				if ((type in events) && console.error) {
					console.error(type + " already exist and cover");
				}

				Model[type.toUpperCase()] = type.toLowerCase();

				events[type.toLowerCase()] = function () {
					events[base].call(this);
					func.call(this);
				};
			}
		};

		return Model;
	})();

	var dynamicModal = {
		fn: undefined,

		check_fn: undefined,

		HTML: (function () {
			return {
				Contain: [
					'<div  class="modal fade" id="femi-modal-contain"  tabindex="-1" role="dialog" aria-labelledby="femi-modal-title" ',
					'aria-hidden="true" data-backdrop="static"  data-keyboard="false" data-show="true" >',
					'<div class="modal-dialog">',
					'<div class="modal-content">',
					'<div class="modal-header">',
					'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
					'<h4 class="modal-title" id="femi-modal-title">{{title}}</h4>',
					'</div>',
					'<div class="modal-body femi-modal-body" >{{items}}</div>',
					'<p class="modal-femi-alarm"></p>',
					'<div class="modal-footer">',
					'<button type="button" class="btn btn-default" data-dismiss="modal" id="femi-modal-close">关闭</button>',
					'<button type="button" class="btn btn-primary" id="femi-modal-confirm">确定</button>',
					'</div>',
					'</div>',
					'</div></div>'
				].join(""),

				ItemBool: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<select class="combobox form-control" data-name="{{name}}" >',
					'<option value=false >false</option>',
					'<option value=true {{select}}" >true</option>',
					'</select>',
					'</div>'
				].join(""),

				ItemString: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="text" class="form-control" data-name="{{name}}" placeholder="{{title}}" value="{{value}}" >',
					'</div>'
				].join(""),
				ItemStringInputArray: ['<div class="femi-modal-item">',
					'<label class="m-detail-title" style="display:inline">{{title}} <span style="float:right;cursor:pointer" class="input-array-add" ><span >添加</span><span class="glyphicon glyphicon-plus-sign" /></span></label>',
					'<input type="text" class="form-control input-array" data-type="input-array" data-name="{{name}}" placeholder="{{title}}"  readonly="readonly" value="{{valueString}}"  />',
					'<div class="input-array-contain" style="height:auto">{{subItems}}</div>',
					'</div>'
				].join(""),


				ItemStringReadonly: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="text" class="form-control" data-name="{{name}}" readonly="readonly" placeholder="{{title}}" value="{{value}}" />',
					'</div>'
				].join(""),

				ItemLongText: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<p contenteditable="true"  style="height: auto;" class="form-control" data-name="{{name}}"  >{{value}}</p>',
					'</div>'
				].join(""),
				ItemDateTime: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-datetime" data-date="{{value}}" data-date-format="yyyy-mm-dd HH:ii">',
					'<input class="form-control" data-type="datetime" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>',
					'</div>'
				].join(""),
				ItemDate: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-date" data-date="{{value}}" data-date-format="yyyy-mm-dd">',
					'<input class="form-control" data-type="date" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>',
					'</div>',
					'</div>'
				].join(""),
				ItemTime: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-time"  data-date-format="hh:ii">',
					'<input class="form-control" data-type="time" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>',
					'</div>',
					'</div>'
				].join(""),

				ItemNumber: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="number"  data-type="number" class="form-control" format="yyyy-MM-dd hh:mm" data-name="{{name}}" placeholder="{{title}}" value={{value}}>',
					'</div>'
				].join(""),
				ItemDropOne: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  class="selectpicker bla bla bli form-control" data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDrop: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"   class="selectpicker bla bla bli form-control" multiple data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDropOneControl: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  data-control="{{control_name}}" class="selectpicker bla bla bli form-control femi-modal-dropOneControl"  data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDropControl: ['<div class="femi-modal-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  data-control="{{control_name}}" class="selectpicker bla bla bli form-control femi-modal-dropControl" multiple  data-live-  search="true">    {{subItems}}</select>',
					'</div>'
				].join(""),

				/*$('#modal_select_{{name}}').selectpicker('val', value); 设置默认值*/
				SubItem: ['<option value="{{value}}" {{selected}}   >{{name}}</option>',].join(""),

				SubItemControl: ['<option value="{{value}}" class="{{cla}}" {{selected}} data-far="{{far}}" >{{name}}</option>',].join(""),
				SubItemInputString: [
					'<div class="input-array-item-c " style="margin:0px;width: 100%;height: 32px;padding-left: 15px;padding-right: 45px;overflow:hidden;line-height:32px; " >',

					'<input type="text" class="input-array-item"  style="font-size: 14px;width:100%;line-height:22px;color: #555;background-color: #fff;padding: 4px 15px;',
					'border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
					'-webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; ',
					'transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;"    value="{{value}}" />',
					'<span style="float:right;position:relative;top:-32px;left:45px;cursor:pointer;" class="input-array-remove" ><span>删除</span><span class="glyphicon glyphicon-minus-sign" /></span></div>'
				].join("")
			};
		})(),
		start: (function () {

			var RefrushInputArrayValue = function ($femi_modal_item) {
				if (!$femi_modal_item[0])
					return;
				var $inputView = $femi_modal_item.find("input.form-control"),
					$Contain = $femi_modal_item.find("div.input-array-contain"),
					ValueTemp = [];

				$Contain.find("div input.input-array-item").each(function (i, item) {
					ValueTemp.push($(item).val());
				});

				$inputView.val(ValueTemp.join(" |,| "));
			};

			//确定事件
			$("body").delegate("#femi-modal-confirm", "click", function () {
				var _data = {};
				var _IsRight = true;
				$("body #femi-modal-contain .femi-modal-body .femi-modal-item").each(function (i, item) {
					var title = $(item).find("label.m-detail-title").html(),
						$value = $(item).find("input.form-control,select.form-control"),
						name = $value.attr("data-name"),
						value,
						cur = new Date(),
						type = $value.attr("data-type");

					if (type) {
						switch (type) {
							case "datetime":
								value = new Date($value.val());
								break;
							case "date":
								value = new Date($value.val());
								break;
							case "time":
								var strTime = $value.val().split(":");
								value = new Date(2000, 1, 1, strTime[0], strTime[1]);
								break;
							case "number":
								value = isNaN($value.val()) ? 0 : Number($value.val());
								break;
							case "input-array":
								value = $value.val().split(" |,| ");
								break;
							default:
								value = $value.val();
								break;
						}
					} else {
						value = $value.val();
					}
					if (!$value[0]) {
						$value = $(item).find("p.form-control,span.form-control");
						name = $value.attr("data-name");
						value = $value.text();
					}


					_data[name] = value;
					if (value == undefined)
						_IsRight = false;

				});
				if (!_IsRight) {
					$(".modal-femi-alarm").html("填写未完成");
					return false;
				}
				if (dynamicModal.check_fn && !dynamicModal.check_fn(_data)) {
					$(".modal-femi-alarm").html("数据验证错误");
					return false;
				}

				$("body").find("#femi-modal-contain,.modal-backdrop.fade.in").remove();
				if (dynamicModal.fn && !$.isEmptyObject(_data)) {
					dynamicModal.fn(_data);
				}
				return false;
			});

			//
			$("body").delegate(".modal .femi-modal-body .femi-modal-item  .input-array-add", "click", function () {
				var $Contain = $(this).closest("label.m-detail-title").nextAll("div.input-array-contain"),
					$inputView = $Contain.prev("input.form-control"),
					$m_item = $Contain.closest(".femi-modal-item");

				$Contain.append(util.template({
					value: ""
				}, dynamicModal.HTML.SubItemInputString));
				RefrushInputArrayValue($m_item);
			});

			$("body").delegate(".modal .femi-modal-body .femi-modal-item  .input-array-remove", "click", function () {
				var $item = $(this).closest("div.input-array-item-c"),
					$m_item = $item.closest(".femi-modal-item");

				$item.remove();
				RefrushInputArrayValue($m_item);
			});

			$("body").delegate(".modal .femi-modal-body .femi-modal-item .input-array-contain .input-array-item-c   input.input-array-item", "change", function () {
				var $this = $(this),
					$m_item = $this.closest(".femi-modal-item");

				RefrushInputArrayValue($m_item);
			});

			$("body").delegate(".modal .femi-modal-body .femi-modal-item select.femi-modal-dropOneControl", "change", function (e) {
				var $this = $(this),
					name = $this.attr("data-name"),
					value = $this.val(),
					$children = $(".modal .femi-modal-body .femi-modal-item select[data-control~=" + name + "]");
				if (value == null)
					return false;
				DropOneHideOption($this);


			});


			$("body").find("#femi-modal-contain").on('hide.bs.modal', function (event) {

				$("body").find("#femi-modal-contain,.modal-backdrop.fade.in").remove();
				return false;
			});

			function DropOneHideOption($this, name, value) {
				var name = $this.attr("data-name"),
					value = $this.val(),
					$children = $(".modal .femi-modal-body .femi-modal-item select[data-control~=" + name + "]");
				if (value == null)
					return false;

				$children.each(function (c_i, c_item) {


					var $BeControl = $(c_item),
						controlName = $($children[0]).attr("data-control"),
						controlNameArray = controlName ? controlName.split(" ") : [],
						index = controlNameArray.indexOf(name);

					if (index != controlNameArray.length - 1)
						return true;

					if (controlNameArray.length > 1) {
						$BeControl.find("option").hide();
						$BeControl.find("option[data-far=" + 0 + "]").show();
						if (value != "" && value != 0) {

							var _farValue = [];
							$.each(controlNameArray, function (ca_i, ca_item) {
								var $Control = $(".modal .femi-modal-body .femi-modal-item select[data-name=" + ca_item + "]");
								if ($Control[0]) {
									_farValue.push($Control.val());
								} else {
									_farValue.push(0);
								}
							});
							$BeControl.find("option[data-far=" + _farValue.join('_') + "]").show();
							$BeControl.find("option[data-far=" + 0 + "]").show();
						}


					} else {
						if (value == "" || value == 0) {
							$BeControl.find("option").show();

						} else {
							$BeControl.find("option").hide();
							$BeControl.find("option[data-far=" + value + "]").show();
							$BeControl.find("option[data-far=" + 0 + "]").show();
						}
					}
					$BeControl.selectpicker("refresh");
					$BeControl.selectpicker("val", "");
					DropOneHideOption($BeControl);

				});
			}
		})(),

		show: function (data, KEYWORD, title, fn, source, check, format) {

			$("body #femi-modal-contain,.modal-backdrop.fade.in").remove();

			dynamicModal.fn = fn;

			dynamicModal.check_fn = check;


			var filter = function (item) {
				var _data = [];
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name: p,
							value: item[p],
							title: o.name,
							type: o.type,
							control_name: o.control ? o.control.replace(",", " ") : undefined
						};
					}
				}

				return _data;
			}(data);

			var Items = {
				title: title,
				items: function (filter_data) {
					var _data = [];
					$.each(filter_data, function (i, item) {
						if (!item)
							return true;
						if (item.type) {

							var _IsOK = true;
							switch (item.type) {
								case "LongText":
									_data.push(util.template(item, dynamicModal.HTML.ItemLongText));

									break;
								case "ArrayOneControl":

									if (!source || !source[item.name])
										return true;

									var _far = undefined;

									var s_index = util.findIndex(source[item.name], function (element, index, array) {
										return element == item.value;
									});
									if (s_index >= 0) {
										_far = source[item.name][s_index].far;
									}

									//没有获取到far时根据输入的defaultVale生成唯一far
									if (item.control_name && item.control_name.length > 0 && (!_far || _far.length < 1)) {
										//筛选显示 
										var _tempFar = [];
										$.each(item.control_name.split(" "), function (_c_i, _c_item) {

											if (data[_c_item])
												_tempFar.push(data[_c_item])
										});
										_far = _tempFar.join("_");
									}

									//相同far显示 不同隐藏 值相等的选中
									$.each(source[item.name], function (_s_i, _s_item) {

										_s_item.selected = "";
										_s_item.cla = "";
										if (_far && _far.length > 0 && _far != _s_item.far && _s_item.far) {

											_s_item.cla = "hidden";
										}
										if (_s_item.value == item.value) {
											_s_item.selected = "selected";
											_s_item.cla = "";
										}
									});
									item.subItems = util.template(source[item.name], dynamicModal.HTML.SubItemControl);
									_data.push(util.template(item, dynamicModal.HTML.ItemDropOneControl));

									break;
								case "ArrayControl":
									if (!source || !source[item.name])
										return true;

									var _far = undefined;
									var s_value = [];
									if (item.value) {
										if (util.isArray(item.value)) {
											s_value = item.value;
										} else {
											s_value.push(item.value);
										}
									}
									var s_index = util.findIndex(source[item.name], function (element, index, array) {

										if (s_value.length > 0)
											return element.value == item.value[0];

										return false;
									});
									if (s_index >= 0) {
										_far = source[item.name][s_index].far;
									}

									if (item.control_name && item.control_name.length > 0 && (!_far || _far.length < 1)) {
										//筛选显示 

										var _tempFar = [];
										$.each(item.control_name.split(" "), function (_c_i, _c_item) {

											if (data[_c_item])
												_tempFar.push(data[_c_item])
										});
										_far = _tempFar.join("_");
									}

									$.each(source[item.name], function (_s_i, _s_item) {

										_s_item.selected = "";
										_s_item.cla = "";
										if (_far != null && _far != undefined && _far != _s_item.far && _s_item.far) {

											_s_item.cla = "hidden";
										}
										var _is_own_index = util.findIndex(s_value, function (element, index, array) {
											return _s_item.value == element;
										});

										if (_is_own_index >= 0) {
											_s_item.selected = "selected";
											_s_item.cla = "";
										} else {
											_s_item.selected = "";
										}

									});
									item.subItems = util.template(source[item.name], dynamicModal.HTML.SubItemControl);
									_data.push(util.template(item, dynamicModal.HTML.ItemDropControl));

									break;
								case "ArrayOne":
									if (!source || !source[item.name])
										return true;


									$.each(source[item.name], function (_s_i, _s_item) {
										_s_item.selected = (_s_item.value == item.value) ? 'selected="selected"' : "";
									});
									item.subItems = util.template(source[item.name], dynamicModal.HTML.SubItem);
									_data.push(util.template(item, dynamicModal.HTML.ItemDropOne));

									break;
								case "Array":
									if (!source || !source[item.name])
										return true;

									if (item.value) {
										var s_value = [];
										if (util.isArray(item.value)) {
											s_value = item.value;
										} else {
											s_value.push(item.value);
										}
										$.each(source[item.name], function (_s_i, _s_item) {
											_s_item.selected = ($.inArray(_s_item.value, s_value) >= 0) ? 'selected="selected"' : "";
										});
									}
									item.subItems = util.template(source[item.name], dynamicModal.HTML.SubItem);

									_data.push(util.template(item, dynamicModal.HTML.ItemDrop));
									break;
								case "DateTime":
									item.value = util.format("yyyy-MM-dd hh:mm", item.value);
									_data.push(util.template(item, dynamicModal.HTML.ItemDateTime));
									break;
								case "Date":
									item.value = util.format("yyyy-MM-dd", item.value);
									_data.push(util.template(item, dynamicModal.HTML.ItemDate));
									break;
								case "Time":
									item.value = util.format("hh:mm", item.value);
									_data.push(util.template(item, dynamicModal.HTML.ItemTime));
									break;
								case "InputArray":
									item.value = item.value ? item.value : [];

									if (!util.isArray(item.value))
										item.value = item.value.split(" |,| ");

									item.valueString = item.value.join(" |,| ");

									var tempValue = [];
									for (var i = 0; i < item.value.length; i++) {
										tempValue.push({
											value: item.value[i]
										});
									}

									item.subItems = util.template(tempValue, dynamicModal.HTML.SubItemInputString);

									_data.push(util.template(item, dynamicModal.HTML.ItemStringInputArray));
									break;
								case "Readonly":
									_data.push(util.template(item, dynamicModal.HTML.ItemStringReadonly));
									break;
								case "Number":
									item.value = isNaN(item.value) ? 0 : Number(item.value);
									_data.push(util.template(item, dynamicModal.HTML.ItemNumber));
									break;
								case "String":
									_data.push(util.template(item, dynamicModal.HTML.ItemString));
									break;
								case "Bool":
									item.select = util.boolean(item.value) ? "selected" : "";
									_data.push(util.template(item, dynamicModal.HTML.ItemBool));
									break;
								default:
									_IsOK = false;
									break;
							}
							if (_IsOK)
								return true;
						}
						if (item.value || item.value == false || item.value == "") {
							if (item.value instanceof Array) {

							} else if (util.isString(item.value)) {
								_data.push(util.template(item, dynamicModal.HTML.ItemString));
							} else if (util.isDate(item.value)) {
								item.value = util.format("yyyy-MM-dd hh:mm", item.value);
								_data.push(util.template(item, dynamicModal.HTML.ItemDate));
							} else if (util.isBoolean(item.value)) {
								item.select = util.boolean(item.value) ? "selected" : "";
								_data.push(util.template(item, dynamicModal.HTML.ItemBool));
							} else if (util.isNumber(item.value)) {
								_data.push(util.template(item, dynamicModal.HTML.ItemNumber));
							} else {
								_data.push(util.template(item, dynamicModal.HTML.ItemString));
							}
						} else {
							_data.push(util.template(item, dynamicModal.HTML.ItemString));
						}
					});
					return _data.join("");

				}(filter)
			};
			$("body").append(util.template(Items, dynamicModal.HTML.Contain));

			if ($('.modal .selectpicker')[0]) {
				$('.modal .selectpicker').find("option.hidden").removeClass("hidden").hide();
				$('.modal .selectpicker').selectpicker();
			}
			if ($('.modal .femi-form-datetime')[0]) {

				$('.modal .femi-form-datetime').datetimepicker({
					format: (format && format.datetime) ? format.datetime : 'yyyy-mm-dd hh:ii',
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 1,
				});
			}
			if ($('.modal .femi-form-date')[0]) {

				$('.modal .femi-form-date').datetimepicker({
					format: (format && format.date) ? format.date : 'yyyy-mm-dd',
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
					forceParse: 1
				});
			}
			if ($('.modal .femi-form-time')[0]) {

				$('.modal .femi-form-time').datetimepicker({
					format: (format && format.time) ? format.time : 'hh:ii',
					autoclose: 1,
					startView: 1,
					minView: 0,
					maxView: 1,
					forceParse: 1
				});
			}

			$("body").find("#femi-modal-contain").modal('show');


		},

		formatter: {
			DateTime: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("yyyy-MM-dd HH:mm", value) + '</span>');
				return html;
			},
			Date: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("yyyy-MM-dd", value) + '</span>');
				return html;
			},
			Time: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("hh:mm", value) + '</span>');
				return html;
			},
			Bool: function (value, row, index) {
				var html = ('<span title="' + value + '">' + (value == true || value == "true") ? "是" : "否" + '</span>');
				return html;
			},
			LongText: function (value, row, index) {
				var html = ('<span title="' + value + '" >' + value + '</span>');
				return html;
			},
			IP: function (value, row, index) {
				if (isNaN(value))
					return value;
				var html = ((value >> 24) & 0xFF) + "." + ((value >> 16) & 0xFF) + "." + ((value >> 8) & 0xFF) + "." + ((value) & 0xFF);
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			},
			Percent: function (value, row, index) {
				if (isNaN(value))
					return value;
				var html = (value * 100) + "%";
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			},
			InputArray: function (value, row, index) {
				if (!util.isArray(value))
					value = [value];
				var html = value.join(" |,| ");
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			}
		},
		getFormatter: function (TypeSource, prop, type) {

			var fn = dynamicModal.formatter[type];
			if (fn)
				return fn;

			return function (value, row, index) {
				var d_array = [];
				$.each(TypeSource[prop], function (d_i, d_item) {
					if (value instanceof Array) {
						if ($.inArray(d_item.value, value) < 0) {
							return true;
						}
						d_array.push(d_item.name);
					}

					if (value == d_item.value) {
						value = [value];
						d_array = [d_item.name];
						return false;
					}
				});

				var html = ('<span title="' + (value instanceof Array ? value.join(",") : value) + '">' + d_array.join(",") + '</span>');
				return html;
			};
		}
	};

	var dynamicPropertyGrid = {
		HTML: (function () {
			return {
				Contain: [
					'<div  class="propertyGrid"  >{{items}}',
					'</div>'
				].join(""),

				ItemBool: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<select class="combobox form-control" data-name="{{name}}" >',
					'<option value=false >否</option>',
					'<option value=true  {{select}} >是</option>',
					'</select>',
					'</div>'
				].join(""),

				ItemString: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="text" class="form-control" data-name="{{name}}" placeholder="{{title}}" value="{{value}}" >',
					'</div>'
				].join(""),
				ItemStringInputArray: ['<div class="femi-property-item">',
					'<label class="m-detail-title" style="display:inline">{{title}} <span style="float:right;cursor:pointer" class="input-array-add" ><span >添加</span><span class="glyphicon glyphicon-plus-sign" /></span></label>',
					'<input type="text" class="form-control input-array" data-type="input-array" data-name="{{name}}" placeholder="{{title}}"  readonly="readonly" value="{{valueString}}"  />',
					'<div class="input-array-contain" style="height:auto">{{subItems}}</div>',
					'</div>'
				].join(""),


				ItemStringReadonly: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="text" class="form-control" data-name="{{name}}" readonly="readonly" placeholder="{{title}}" value="{{value}}" />',
					'</div>'
				].join(""),

				ItemLongText: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<p contenteditable="true"  style="height: auto;" class="form-control" data-name="{{name}}"  >{{value}}</p>',
					'</div>'
				].join(""),
				ItemDateTime: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-datetime" data-date="{{value}}" data-date-format="yyyy-mm-dd HH:ii">',
					'<input class="form-control" data-type="datetime" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>',
					'</div>'
				].join(""),
				ItemDate: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-date" data-date="{{value}}" data-date-format="yyyy-mm-dd">',
					'<input class="form-control" data-type="date" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>',
					'</div>',
					'</div>'
				].join(""),
				ItemTime: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<div class="input-group date femi-form-time"  data-date-format="hh:ii">',
					'<input class="form-control" data-type="time" size="16" type="text" data-name="{{name}}" value="{{value}}" placeholder="{{title}}" >',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>',
					'<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>',
					'</div>',
					'</div>'
				].join(""),

				ItemNumber: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<input type="number"  data-type="number" class="form-control" format="yyyy-MM-dd hh:mm" data-name="{{name}}" placeholder="{{title}}" value={{value}}>',
					'</div>'
				].join(""),
				ItemDropOne: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  class="selectpicker bla bla bli form-control" data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDrop: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"   class="selectpicker bla bla bli form-control" multiple data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDropOneControl: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  data-control="{{control_name}}" class="selectpicker bla bla bli form-control femi-modal-dropOneControl"  data-live-search="true">{{subItems}}</select>',
					'</div>'
				].join(""),
				ItemDropControl: ['<div class="femi-property-item">',
					'<label class="m-detail-title">{{title}}</label>',
					'<label for="modal_select_{{name}}" ></label>',
					'<select id="modal_select_{{name}}"  data-name="{{name}}"  data-control="{{control_name}}" class="selectpicker bla bla bli form-control femi-modal-dropControl" multiple  data-live-  search="true">    {{subItems}}</select>',
					'</div>'
				].join(""),

				/*$('#modal_select_{{name}}').selectpicker('val', value); 设置默认值*/
				SubItem: ['<option value="{{value}}" {{selected}}   >{{name}}</option>',].join(""),

				SubItemControl: ['<option value="{{value}}" class="{{cla}}" {{selected}} data-far="{{far}}" >{{name}}</option>',].join(""),
				SubItemInputString: [
					'<div class="input-array-item-c " style="margin:0px;width: 100%;height: 32px;padding-left: 15px;padding-right: 45px;overflow:hidden;line-height:32px; " >',

					'<input type="text" class="input-array-item"  style="font-size: 14px;width:100%;line-height:22px;color: #555;background-color: #fff;padding: 4px 15px;',
					'border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);',
					'-webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; ',
					'transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;"    value="{{value}}" />',
					'<span style="float:right;position:relative;top:-32px;left:45px;cursor:pointer;" class="input-array-remove" ><span>删除</span><span class="glyphicon glyphicon-minus-sign" /></span></div>'
				].join("")
			};
		})(),
		start: (function () {

			var RefrushInputArrayValue = function ($femi_modal_item) {
				if (!$femi_modal_item[0])
					return;
				var $inputView = $femi_modal_item.find("input.form-control"),
					$Contain = $femi_modal_item.find("div.input-array-contain"),
					ValueTemp = [];

				$Contain.find("div input.input-array-item").each(function (i, item) {
					ValueTemp.push($(item).val());
				});

				$inputView.val(ValueTemp.join(" |,| "));
			};

			$("body").delegate("#femi-modal-confirm", "click", function () {

				return false;
			});


			$("body").delegate(".propertyGrid .femi-property-item  .input-array-add", "click", function () {
				var $Contain = $(this).closest("label.m-detail-title").nextAll("div.input-array-contain"),
					$inputView = $Contain.prev("input.form-control"),
					$m_item = $Contain.closest(".femi-property-item");

				$Contain.append(util.template({
					value: ""
				}, dynamicPropertyGrid.HTML.SubItemInputString));
				RefrushInputArrayValue($m_item);
			});


			$("body").delegate(".propertyGrid  .femi-property-item  .input-array-remove", "click", function () {
				var $item = $(this).closest("div.input-array-item-c"),
					$m_item = $item.closest(".femi-property-item");

				$item.remove();
				RefrushInputArrayValue($m_item);
			});
			$("body").delegate(".propertyGrid  .femi-property-item .input-array-contain .input-array-item-c   input.input-array-item", "change", function () {
				var $this = $(this),
					$m_item = $this.closest(".femi-property-item");

				RefrushInputArrayValue($m_item);
			});

			$("body").delegate(".propertyGrid  .femi-property-item select.femi-modal-dropOneControl", "change", function (e) {
				var $this = $(this),
					name = $this.attr("data-name"),
					value = $this.val(),
					$children = $this.closest(".propertyGrid").find(".femi-property-item select[data-control~=" + name + "]");

				DropOneHideOption($this);


			});


			function DropOneHideOption($this, name, value) {
				var name = $this.attr("data-name"),
					value = $this.val(),
					$children = $this.closest(".propertyGrid").find(".femi-property-item select[data-control~=" + name + "]");


				$children.each(function (c_i, c_item) {


					var $BeControl = $(c_item),
						controlName = $($children[0]).attr("data-control"),
						controlNameArray = controlName ? controlName.split(" ") : [],
						index = controlNameArray.indexOf(name);

					if (index != controlNameArray.length - 1)
						return true;

					if (controlNameArray.length > 1) {
						$BeControl.find("option").hide();
						$BeControl.find("option[data-far=" + 0 + "]").show();
						if (value != "" && value != 0) {

							var _farValue = [];
							$.each(controlNameArray, function (ca_i, ca_item) {
								var $Control = $(".modal .femi-modal-body .femi-property-item select[data-name=" + ca_item + "]");
								if ($Control[0]) {
									_farValue.push($Control.val());
								} else {
									_farValue.push(0);
								}
							});
							$BeControl.find("option[data-far=" + _farValue.join('_') + "]").show();
							$BeControl.find("option[data-far=" + 0 + "]").show();
						}


					} else {
						if (value == "" || value == 0) {
							$BeControl.find("option").show();

						} else {
							$BeControl.find("option").hide();
							$BeControl.find("option[data-far=" + value + "]").show();
							$BeControl.find("option[data-far=" + 0 + "]").show();
						}
					}
					$BeControl.selectpicker("refresh");
					$BeControl.selectpicker("val", "");
					DropOneHideOption($BeControl);

				});
			}
		})(),

		getData: function ($target) {
			var _data = {};
			var _IsRight = true;
			$target.find(".propertyGrid .femi-property-item").each(function (i, item) {
				var title = $(item).find("label.m-detail-title").html(),
					$value = $(item).find("input.form-control,select.form-control"),
					name = $value.attr("data-name"),
					value,
					cur = new Date(),
					type = $value.attr("data-type");

				if (type) {
					switch (type) {
						case "datetime":
							value = new Date($value.val());
							break;
						case "date":
							value = new Date($value.val());
							break;
						case "time":
							var strTime = $value.val().split(":");
							value = new Date(2000, 1, 1, strTime[0], strTime[1]);
							break;
						case "number":
							value = isNaN($value.val()) ? 0 : Number($value.val());
							break;
						case "input-array":
							value = $value.val().split(" |,| ");
							break;
						default:
							value = $value.val();
							break;
					}
				} else {
					value = $value.val();
				}
				if (!$value[0]) {
					$value = $(item).find("p.form-control,span.form-control");
					name = $value.attr("data-name");
					value = $value.text();
				}


				_data[name] = value;
				if (value == undefined)
					_IsRight = false;

			});

			return {
				success: _IsRight,
				data: _data
			}
		},

		show: function ($target, data, KEYWORD, source, format) {

			if (!$target || !$target[0])
				return false;

			var filter = function (item) {
				var _data = [];
				for (var p in item) {
					var o = KEYWORD[p];
					if (o) {
						_data[Number(o.index)] = {
							name: p,
							value: item[p],
							title: o.name,
							type: o.type,
							control_name: o.control ? o.control.replace(",", " ") : undefined
						};
					}
				}

				return _data;
			}(data);

			var Items = {
				items: function (filter_data) {
					var _data = [];
					$.each(filter_data, function (i, item) {
						if (!item)
							return true;
						if (item.type) {

							var _IsOK = true;
							switch (item.type) {
								case "LongText":
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemLongText));

									break;
								case "ArrayOneControl":

									if (!source || !source[item.name])
										return true;

									var _far = undefined;

									var s_index = util.findIndex(source[item.name], function (element, index, array) {
										return element == item.value;
									});
									if (s_index >= 0) {
										_far = source[item.name][s_index].far;
									}

									if (item.control_name && item.control_name.length > 0 && (!_far || _far.length < 1)) {
										//筛选显示 
										var _tempFar = [];
										$.each(item.control_name.split(" "), function (_c_i, _c_item) {

											if (data[_c_item])
												_tempFar.push(data[_c_item])
										});
										_far = _tempFar.join("_");
									}

									$.each(source[item.name], function (_s_i, _s_item) {

										_s_item.selected = "";
										_s_item.cla = "";
										if (_far && _far.length > 0 && _far != _s_item.far && _s_item.far) {

											_s_item.cla = "hidden";
										}
										if (_s_item.value == item.value) {
											_s_item.selected = "selected";
											_s_item.cla = "";
										}
									});
									item.subItems = util.template(source[item.name], dynamicPropertyGrid.HTML.SubItemControl);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDropOneControl));

									break;
								case "ArrayControl":
									if (!source || !source[item.name])
										return true;

									var _far = undefined;

									var s_index = util.findIndex(source[item.name], function (element, index, array) {
										return element == item.value;
									});
									if (s_index >= 0) {
										_far = source[item.name][s_index].far;
									}

									if (item.control_name && item.control_name.length > 0 && (!_far || _far.length < 1)) {
										//筛选显示 

										var _tempFar = [];
										$.each(item.control_name.split(" "), function (_c_i, _c_item) {

											if (data[_c_item])
												_tempFar.push(data[_c_item])
										});
										_far = _tempFar.join("_");
									}

									$.each(source[item.name], function (_s_i, _s_item) {

										_s_item.selected = "";
										_s_item.cla = "";
										if (_far != null && _far != undefined && _far != _s_item.far && _s_item.far) {

											_s_item.cla = "hidden";
										}
										if (_s_item.value == item.value) {
											_s_item.selected = "selected";
											_s_item.cla = "";
										}
									});
									item.subItems = util.template(source[item.name], dynamicPropertyGrid.HTML.SubItemControl);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDropControl));

									break;
								case "ArrayOne":
									if (!source || !source[item.name])
										return true;


									$.each(source[item.name], function (_s_i, _s_item) {
										_s_item.selected = (_s_item.value == item.value) ? 'selected="selected"' : "";
									});
									item.subItems = util.template(source[item.name], dynamicPropertyGrid.HTML.SubItem);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDropOne));

									break;
								case "Array":
									if (!source || !source[item.name])
										return true;

									if (item.value) {
										var s_value = [];
										if (util.isArray(item.value)) {
											s_value = item.value;
										} else {
											s_value.push(item.value);
										}
										$.each(source[item.name], function (_s_i, _s_item) {
											_s_item.selected = ($.inArray(_s_item.value, s_value) >= 0) ? 'selected="selected"' : "";
										});
									}
									item.subItems = util.template(source[item.name], dynamicPropertyGrid.HTML.SubItem);

									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDrop));
									break;
								case "DateTime":
									item.value = util.format("yyyy-MM-dd hh:mm", item.value);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDateTime));
									break;
								case "Date":
									item.value = util.format("yyyy-MM-dd", item.value);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDate));
									break;
								case "Time":
									item.value = util.format("hh:mm", item.value);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemTime));
									break;
								case "InputArray":
									item.value = item.value ? item.value : [];

									if (!util.isArray(item.value))
										item.value = item.value.split(" |,| ");

									item.valueString = item.value.join(" |,| ");

									var tempValue = [];
									for (var i = 0; i < item.value.length; i++) {
										tempValue.push({
											value: item.value[i]
										});
									}

									item.subItems = util.template(tempValue, dynamicPropertyGrid.HTML.SubItemInputString);

									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemStringInputArray));
									break;
								case "Readonly":
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemStringReadonly));
									break;
								case "Number":
									item.value = isNaN(item.value) ? 0 : Number(item.value);
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemNumber));
									break;
								case "String":
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemString));
									break;
								case "Bool":
									item.select = util.boolean(item.value) ? "selected" : "";
									_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemBool));
									break;
								default:
									_IsOK = false;
									break;
							}
							if (_IsOK)
								return true;
						}
						if (item.value || item.value == false || item.value == "") {
							if (item.value instanceof Array) {

							} else if (util.isString(item.value)) {
								_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemString));
							} else if (util.isDate(item.value)) {
								item.value = util.format("yyyy-MM-dd hh:mm", item.value);
								_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemDate));
							} else if (util.isBoolean(item.value)) {
								item.select = util.boolean(item.value) ? "selected" : "";
								_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemBool));
							} else if (util.isNumber(item.value)) {
								_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemNumber));
							} else {
								_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemString));
							}
						} else {
							_data.push(util.template(item, dynamicPropertyGrid.HTML.ItemString));
						}
					});
					return _data.join("");

				}(filter)
			};
			$target.html(util.template(Items, dynamicPropertyGrid.HTML.Contain));

			if ($target.find('.propertyGrid .selectpicker')[0]) {
				$target.find('.propertyGrid .selectpicker').find("option.hidden").removeClass("hidden").hide();
				$target.find('.propertyGrid .selectpicker').selectpicker();
			}
			if ($target.find('.propertyGrid .femi-form-datetime')[0]) {

				$target.find('.propertyGrid .femi-form-datetime').datetimepicker({
					format: (format && format.datetime) ? format.datetime : 'yyyy-mm-dd hh:ii',
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 1,
				});
			}
			if ($target.find('.propertyGrid .femi-form-date')[0]) {

				$target.find('.propertyGrid .femi-form-date').datetimepicker({
					format: (format && format.date) ? format.date : 'yyyy-mm-dd',
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					minView: 2,
					forceParse: 1
				});
			}
			if ($target.find('.propertyGrid .femi-form-time')[0]) {

				$target.find('.propertyGrid .femi-form-time').datetimepicker({
					format: (format && format.time) ? format.time : 'hh:ii:ss',
					autoclose: 1,
					startView: 1,
					minView: 0,
					maxView: 1,
					forceParse: 1
				});
			}

			//  $("body").find("#femi-modal-contain").modal('show');


		},

		formatter: {
			DateTime: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("yyyy-MM-dd HH:mm:ss", value) + '</span>');
				return html;
			},
			Date: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("yyyy-MM-dd", value) + '</span>');
				return html;
			},
			Time: function (value, row, index) {
				var html = ('<span title="' + value + '">' + util.format("hh:mm:ss", value) + '</span>');
				return html;
			},
			Bool: function (value, row, index) {
				var html = ('<span title="' + value + '">' + (value == true || value == "true") ? "是" : "否" + '</span>');
				return html;
			},
			LongText: function (value, row, index) {
				var html = ('<span title="' + value + '">' + value + '</span>');
				return html;
			},
			IP: function (value, row, index) {
				if (isNaN(value))
					return value;
				var html = ((value >> 24) & 0xFF) + "." + ((value >> 16) & 0xFF) + "." + ((value >> 8) & 0xFF) + "." + ((value) & 0xFF);
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			},
			Percent: function (value, row, index) {
				if (isNaN(value))
					return value;
				var html = (value * 100) + "%";
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			},
			InputArray: function (value, row, index) {
				if (!util.isArray(value))
					value = [value];
				var html = value.join(" |,| ");
				html = ('<span title="' + html + '" >' + html + '</span>');
				return html;
			}
		},
		getFormatter: function (TypeSource, prop, type) {

			var fn = dynamicPropertyGrid.formatter[type];
			if (fn)
				return fn;

			return function (value, row, index) {
				var d_array = [];
				$.each(TypeSource[prop], function (d_i, d_item) {
					if (value instanceof Array) {
						if ($.inArray(d_item.value, value) < 0) {
							return true;
						}
						d_array.push(d_item.name);
					}

					if (value == d_item.value) {
						value = [value];
						d_array = [d_item.name];
						return false;
					}
				});

				var html = ('<span title="' + (value instanceof Array ? value.join(",") : value) + '">' + d_array.join(",") + '</span>');
				return html;
			};
		}
	};
	

	$(function () {
		var KEYWORD_LIST = [],
			KEYWORD = {},
			FORMATTRT_LIST = {},
			DEFAULT_VALUE = {},
			SubmitData = {},
			TypeSource = {};

		//获取配置
		var getAllList = function (data, fn, context) {
			var d = {
				$URI: "/TableConfig/ALL",
				$TYPE: "get",
				$SERVER: "/MESCore"
			};

			function err() {
				app.tip('获取失败，请检查网络');
			}

			app.ajax($.extend(d, data), fn, err, context);
		}

		//提交接口数据
		var postAllList = function (data, fn, context) {
			var d = {
				$URI: "/TableConfig/Save",
				$TYPE: "post",
				$SERVER: "/MESCore"
			};

			function err() {
				app.tip('获取失败，请检查网络');
			}

			app.ajax($.extend(d, data), fn, err, context);
		}

		//根据配置获取表格配置
		var getTableConfig = function ($this, fn) {

			getAllList({
				TableName: $this.tableName,
				ModleName: $this.moduleName
			}, function (rst) {
				//未配置表格
				if (rst.list.length == 0) {
					SubmitData.ID = 0;
					SubmitData.TableName = $this.tableName;
					SubmitData.Counts = 5;
					SubmitData.ModleName = $this.moduleName;
					SubmitData.list = [];
					fn(rst.list);
				} else {
					//已配置表格 根据返回设置默认值
					var def = {};
					SubmitData = rst.list[0];
					$.each(rst.list[0].list, function (i, item) {
						if (item.IsVisiable == 1) {
							def["" + item.FieldName] = 1
						} else {
							def["" + item.FieldName] = 0;
						}

					});
					DEFAULT_VALUE = def;
					fn(rst.list);
				}

			});
		};


		$(".tableConfig").each(function (e_i, e_item) {

			var $this = $(e_item),
				TBObj = {};
			//tableName
			TBObj.tableName = $this.attr("data-table");
			//moduleName
			TBObj.moduleName = $this.attr("data-module");
			//table类名
			TBObj.tableCalss = $this.attr("table-class");
			TBObj.domobj = $this;

			//得到每一个对应的table对象
			var $table = $("table." + TBObj.tableCalss);

			//			//var _tableClass = $table.attr("class");
			//			//var _tableArray = _tableClass.trim().split(" ");
			//			_tableClass = "";
			//			$.each(_tableArray, function(i, item) {
			//				if (!item || item.length <= 0)
			//					return true;
			//				_tableClass = _tableClass + "." + item;
			//			});
			//创建一个样式元素
			var new_style = document.createElement("style");
			if ($table.find("style")[0]) {
				$table.find("style").remove();
			}
			var _style = "";

			getTableConfig(TBObj, function (list) {
				$.each(list, function (e_j, e_jtem) {
					if (e_jtem.TableName == TBObj.tableName && e_jtem.ModleName == TBObj.moduleName) {
						$.each(e_jtem.list, function (e_k, e_ktem) {
							if (e_ktem.IsVisiable == 0) {
								// _style += ' th[data-order=' + e_ktem.FieldName + ']{ display:none; }';
								// _style += ' td[data-title=' + e_ktem.FieldName + ']{ display:none; }  ';
								_style += 'table.'+TBObj.tableCalss+' th[data-order=' + e_ktem.FieldName + ']{ display:none; }  ';
								_style += 'table.'+TBObj.tableCalss+' td[data-title=' + e_ktem.FieldName + ']{ display:none; }  ';
							}
						});
					}
				});
				new_style.innerHTML = (_style);
				//将样式元素插入表格中
				$table.prepend(new_style);
			});


		});


		//为按钮注册函数
		$("body").delegate(".tableConfig", "click", function (e) {
			var $this = $(this),
				TBObj = {};

			TBObj.tableName = $this.attr("data-table");
			TBObj.moduleName = $this.attr("data-module");

			TBObj.tableCalss = $this.attr("table-class");
			TBObj.domobj = $this;


			var $table = $("table." + TBObj.tableCalss);
			if($table[0]){
				$table=$($table[0]);
			}
			 
		 
			KEYWORD_LIST = [];
			KEYWORD = {};
			FORMATTRT_LIST = {};
			DEFAULT_VALUE = {};
			SubmitData = {};
			TypeSource = {};
			//获取这个表格对应的所有的data-order
			$table.find("thead tr th").each(function (i, item) {
				var dataOrder = $(item).attr("data-order"),
					//表格对应显示的东西
					dataTitle = $(item).text();
				if (dataOrder && dataOrder.length > 0) {
					KEYWORD_LIST.push(dataOrder + "|" + dataTitle + "|ArrayOne");
					TypeSource["" + dataOrder] = [];
					TypeSource["" + dataOrder].push({
						name: "隐藏",
						value: 0
					});
					TypeSource["" + dataOrder].push({
						name: "显示",
						value: 1
					});
					DEFAULT_VALUE["" + dataOrder] = 1;
				}
			});

			$.each(KEYWORD_LIST, function (i, item) {
				var detail = item.split("|");
				KEYWORD[detail[0]] = {
					index: i,
					name: detail[1],
					type: detail.length > 2 ? detail[2] : undefined,
					control: detail.length > 3 ? detail[3] : undefined
				};
				if (detail.length > 2) {
					FORMATTRT_LIST[detail[0]] = util.getFormatter(TypeSource, detail[0], detail[2]);
				}
			});

			getTableConfig(TBObj, function (result) {
				$("body").append(dynamicModal.show(DEFAULT_VALUE, KEYWORD, "表头显示配置", function (rst) {
					//调用修改函数
					if (!rst || $.isEmptyObject(rst))
						return;

					if (SubmitData.list.length > 0) {
						$.each(SubmitData.list, function (i, item) {
							for (var p in rst) {
								if (item.FieldName == p) {
									item.IsVisiable = Number(rst[p]);
								}
							}
						});
					} else {
						for (var p in rst) {
							SubmitData.list.push({
								ID: 0,
								//表格ID 给零后台自动级联了
								TableID: 0,
								//字段名称
								FieldName: p,
								//字段含义 目前先不管
								FieldText: "",
								//是否显示
								IsVisiable: Number(rst[p]),
								//字段顺序 目前先不管
								FieldOrder: 0,
								//字段最小宽度 单位为px 目前先不管
								FieldWidth: 1
							})
						}
					}

					var arr = [];
					util.deleteLowerProperty(SubmitData.list);
					arr.push(SubmitData);

					postAllList({
						data: arr
					}, function (res) {
						var new_style = document.createElement("style");
						if ($table.find("style")[0]) {
							$table.find("style").remove();
						}
						var _style = "";
						$.each(SubmitData.list, function (i, item) {
							if (item.IsVisiable == 0) {
								_style += 'table.'+TBObj.tableCalss+' th[data-order=' + item.FieldName + ']{ display:none; }  ';
								_style += 'table.'+TBObj.tableCalss+' td[data-title=' + item.FieldName + ']{ display:none; }  ';
							}
						});
						new_style.innerHTML = (_style);
						$table.prepend(new_style);
						alert("配置成功");
					})

				}, TypeSource));
			});
		});
	});


	if (!!window.ActiveXObject || "ActiveXObject" in window) {
		try {
			var objShell = new ActiveXObject("WScript.Shell");
			objShell.Run("cmd.exe /c start chrome " + window.location.href, 0, true);
		} catch (error) {
			console.log(error);
		} 
	}
 
	return {
		cookie: cookie,
		math: math,
		app: app,
		util: util,
		uri: uri,
		Model: module,
		modal: dynamicModal,
		propertyGrid: dynamicPropertyGrid,
		table: tableTool,
	};

});