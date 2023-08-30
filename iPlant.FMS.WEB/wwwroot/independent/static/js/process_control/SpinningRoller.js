require(['../static/utils/js/jquery-3.1.1', '../static/utils/js/base/base'],
    function ($lin, $com) {
        var mDeviceID ;
        var model = $com.Model.create({
            el: "#fxy-app",
            VueName: "vm",
            name: '移动式架车机',
            data: {
                Basics:{
                    "1.1":"SHANG HAI HONG QIAO 101595",
                    "2.1":"2018.05.22",
                    "2.2":"21:10:51",
                    "2.3":"947",
                    "2.4":"QQ 01",
                    "2.5":"0",
                    "2.6":"CRH3 (380B/BL) 34.5 26 2500MM",
                    "2.7":"CRH334.5,34,33.5,33,32.5,32,31.5,31,30.5,30,29.5,29,28.5,28,27.5,27,26.5,26 P3806 3726",
                    "2.8":"CRH380BL 3570 10 04",
                    "2.9":"0",
                    "2.10":"2",
                    "2.11":"",
                    "2.12":"1",
                    "2.13":"1",
                    "2.14":"CRH380BL",
                    "2.15":"2782066",
                },
                BeforeCorrection:{

                }
            },
            type: $com.Model.MAIN, //主方法

            configure: function () {
                this.run();
            },
            events: function () {

            },

            run: function () {


            },

            com: {

            }
        })
        model.init();


    });