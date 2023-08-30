require([ './static/utils/js/jquery-3.1.1', './static/utils/js/base/base' ], function($yang, $com) {

	var model,
		HTML;

	HTML = {
		List_Menu : [
			'<li class="femi-fl-lf">',
			'<div class="femi-menu-bg">',
			'<span >{{name}}<b class="caret" style="margin-bottom: 5px"></b></span>',
			'<ul class="femi-neck-float">{{menuHtml}}</ul>',
			'</div>',
			'</li>',
		].join(""),
		List_Item : [
			'<li><div data-src="{{url}}">{{name}}</div></li>',
		].join("")
	};

	model = $com.Model.create({
		name : '设备管理系统',

		type : $com.Model.MAIN,

		configure : function() {
			this.run();
		},

		events : function() {
			$("body").delegate("#window_close", "click", function() {
				var $this = $(this);
				model.com.close({}, function() {
					window.location.href = "../index.html";
				});
			})


			$("body").delegate(".femi-neck .femi-neck-float .femi-neck-float div", "mouseover", function() {

				var $this = $(this);
				$this.css("background-color", "#4A708B");
				$this.css("border-top-color", "#97FFFF");
			}).delegate(".femi-neck .femi-neck-float .femi-neck-float div", "mouseout", function() {

				var $this = $(this);
				$this.css("background-color", "#00688B");
				$this.css("border-top-color", "white");
			}).delegate(".femi-neck .femi-neck-float .femi-neck-float div", "click", function() {
				var $this = $(this);

				$this.parents("div.femi-menu-bg").css("overflow", "hidden");
				var src = $this.attr("data-src");
				if (src && src.length) {
					$("#iframeContain").attr("src", src);
				}



			});

		},

		run : function() {

		  /*
			this.com.get({}, function(data) {
				model._data = data.info;

				$("#userLabel").html(data.info.user.name);
				$("#userLabel").attr("title",data.info.user.loginName)
				$("#companyLabel").html(data.info.user.companyName);
				$("#userImg").attr("src", data.info.user.faces);
				$("#companyImg").attr("src", data.info.user.companyFaces);

				model.com.render(data.info.module);
				
				$("[data-toggle='tooltip']").tooltip();
			});*/
 
		},

		com : {
			get : function(data, fn, context) {
				var d = {
					$URI : "/HomePage/WebShow",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('主页获取失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			},
			 
			close : function(data, fn, context) {
				var d = {
					$URI : "/User/Logout",
					$TYPE : "get"
				};

				function err() {
					$com.app.tip('退出失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);

			},
			render : function(data) {

				$.each(data, function(i, item) {
					item.menuHtml = $com.util.template(item.moduleItems, HTML.List_Item);
				});

				$("#moduleContain").html($com.util.template(data, HTML.List_Menu));

			}
		}
	});

	model.init();


});