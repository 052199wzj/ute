require(['./static/utils/js/jquery-3.1.1', './static/utils/js/base/base'], function ($yang, $com) {

    var model;


    model = $com.Model.create({
        name: 'iPlantMES密码修改',

        type: $com.Model.MAIN,

        configure: function () {
            this.run();


        },

        events: function () {

            $("body").delegate("#repair", "click", function () {
                this.focus();
                var data = {}, data_r = {};
                data.user_id = $("#inputUser").val();
                data.passWord = $("#inputPassword").val();


                var newPassWord = $("#newPassword").val(),
                    confirmPassWord = $("#confirmPassword").val();


                if (newPassWord && confirmPassWord && newPassWord != confirmPassWord) {
                    $(".femi-login-alarm strong").text("两次输入的密码不一致！！！");
                    $(".femi-login-alarm").show();
                    return false;
                }

                if (newPassWord.length < 6) {
                    $(".femi-login-alarm strong").text("密码长度不能小于6位！！！");
                    $(".femi-login-alarm").show();
                    return false;
                }

                data_r.Id = data.user_id;
                data_r.user_name = $("#inputUser").val();
                data_r.PassWord = newPassWord;
                data_r.OldPassWord = data.passWord;
                data.user_name = $("#inputUser").val();
                if (data.user_id && data.passWord && newPassWord && confirmPassWord) {
                    $com.app.loading("修改中...");
                    console.log(data);
                    model.com.post(data, function (rst) {

                        model.com.repair(data_r, function (rst) {
                            $com.app.loaded();
                            alert("修改成功", function () {
                                window.location = "./contain.html";
                            });

                        });


                    });
                } else {
                    $(".femi-login-alarm strong").text("键入信息不完整！！！");
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
                    $com.app.tip('修改失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            repair: function (data, fn, context) {
                var d = {
                    $URI: "/User/PasswordModify",
                    $TYPE: "post"
                };

                function err() {
                    $com.app.tip('修改失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            }
        }
    });

    model.init();


});