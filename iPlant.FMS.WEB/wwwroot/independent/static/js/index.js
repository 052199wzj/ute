require(['./independent/static/utils/js/jquery-3.1.1', './independent/static/utils/js/base/base'], function ($yang, $com) {

	var model;


	model = $com.Model.create({
		name: '中石油天津大港测井射孔枪产线管控系统登录',

		type: $com.Model.MAIN,

		configure: function () {
			this.run();


		},

		events: function () {

			$("body").delegate("#login", "click", function () {
				this.focus();
				var data = {};
				data.user_id = $("#inputUser").val();
				data.passWord = $("#inputPassword").val();
				data.user_name = $("#inputUser").val();
				if (data.user_id && data.passWord) {
					$com.app.loading("登录中...");

					model.com.post(data, function (rst) {
						var _obj = rst.info;
						//window.location = "./independent/contain.html?Grad="+_obj.Grad;
						window.location = "./independent/contain.html";
					});
				} else {
					$(".femi-login-alarm").show();
				}

			});

			document.getElementById("inputPassword").onkeydown = function (event) {

				var e = event || window.event || arguments.callee.caller.arguments[0];

				if (e && e.keyCode == 13) { // enter 键
					$("#login").click();
					return false;
				}
			};

		},

		run: function () {
			$(".femi-login-alarm").hide();
		},

		com: {
			post: function (data, fn, context) {
				var d = {
					$URI: "/User/Login",
					$TYPE: "post"
				};

				function err() {
					$com.app.tip('登录失败，请检查网络');
				}

				$com.app.ajax($.extend(d, data), fn, err, context);
			}
		}
	});

	model.init();


});
