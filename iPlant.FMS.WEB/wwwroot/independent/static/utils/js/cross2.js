define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var dataRole,
            selectNum = 0,
            selectCandidateNum,
            selectNoticeNum,
            selectedCandidateData = [],
            selectedNoticeData = [],
            defaultCandidateUserData,
            defaultnoticeUserData;

        //var basicData = {
        //    roleData: [],
        //    selectedData: [],
        //    $util: "",
        //    $transfer: "",
        //    SelectedUserData: [],
        //    returnData: []
        //    },
        //    ResObj = {
        //        fn: function () { },
        //    };
        var HTML = {
            AllRoleListNode: [
            '<li class="cby-role-item" data-value={{ID}} data-name={{Name}}>',
                '<span>{{Name}}</span>',
            '</li>',
            ].join(''),
            UserListNode: [
                '<li data-value="{{ID}}" class="cby-user-show" data-name={{Name}}>',
                    '<input type="checkbox" name="" value="">',
                    '<span>{{Name}}</span>',
                '</li>',
            ].join(''),
            SelectedUserListNode: [
                '<li  data-value="{{ID}}" class="cby-user-show" data-name={{Name}}>',
                    '<input type="checkbox" name="" value="">',
                    '<span>{{Name}}</span>',
                '</li>',
            ].join(''),
            CandidateUserListNode: [
                '<li  data-value="{{ID}}" class="cby-user-show" data-name={{Name}}>',
                    '<input type="checkbox" name="" value="">',
                    '<span>{{Name}}</span>',
                '</li>',
            ].join(''),
            NoticeUserListNode: [
                '<li  data-value="{{ID}}" class="cby-user-show" data-name={{Name}}>',
                    '<input type="checkbox" name="" value="">',
                    '<span>{{Name}}</span>',
                '</li>',
            ].join(''),



            RoleItemMode: [
                '<li class="cby-role-item" data-title="{{RoleID}}">',
                '<span>{{RoleName}}</span>',
                '</li>',
            ].join(""),
            crossTemplate: [
                '<div class="cby-cbd-contain">',
                '<div class="femi-left femi-lf cby-cross-left" >',
                '<div class="cby-role-list-title">',
                '<span>角色</span>',
                '</div>',
                '<ul class="cby-role-list" id="cby-role-lists">',
                '</ul>',
                '</div>',
                '<div class="femi-full-bd cby-cross-right">',
                '<div id="test1" class="demo-transfer" align="left"></div>',
                '</div>',
                '</div>',
            ].join(""),
        }
        var Cotent=[
        '<div class="cby-cbd-contain-back">',
            '<div class="" style="height: 100%; border: 2px solid #E6E6E6;">',
            '<div class="femi-left femi-lf cby-cross-left" >',
                '<div class="cby-role-list-title">',
                    '<span>角色</span>',
                '</div>',
                '<ul class="cby-role-list" id="cby-role-lists">',
                '</ul>',
            '</div>',
            '<div class="femi-full-bd cby-cross-right">',
                '<div id="test1" class="cby-cross-left-contain">',
                    '<div class="cby-role-list-title">',
                        '<input type="checkbox" name="" value="" id="cby-select-all-left">',
                        '<span>待选角色人员</span>',
                    '</div>',
                    '<ul class="cby-role-list-select cby-role-list" id="cby-select-user">',
                    '</ul>',
                '</div>',
                '<div class="cby-cross-center-contain">',
                    '<div class="cby-button-contain" style="border-bottom: 1px solid #e6e6e6;">',
                        '<div class="cby-cross-center-contain-div">',
                           '<button class="cby-cross-center-contain-button" id="cby-candidate-cross-right"><i class="layui-icon layui-icon-next"></i></button>',
                        '</div>',
                        '<div class="cby-cross-center-contain-div">',
                            '<button class="cby-cross-center-contain-button" id="cby-candidate-cross-left"><i class="layui-icon layui-icon-prev"></i></button>',
                        '</div>',
                    '</div>',
                    '<div class="cby-button-contain">',
                        '<div class="cby-cross-center-contain-div">',
                            '<button class="cby-cross-center-contain-button" id="cby-notice-cross-right"><i class="layui-icon layui-icon-next"></i></button>',
                        '</div>',
                        '<div class="cby-cross-center-contain-div">',
                            '<button class="cby-cross-center-contain-button" id="cby-notice-cross-left"><i class="layui-icon layui-icon-prev"></i></button>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="test2" class="cby-cross-right-contain">',
                    '<div class="cby-selected-candidate cby-contain-selected">',
                        '<div class="cby-role-list-title">',
                            '<input type="checkbox" name="" value="" id="cby-selectd-candidate-left">',
                            '<span>已选候选人</span>',
                        '</div>',
                        '<ul class="cby-role-list-selected cby-role-list" id="cby-selected-user-candidate" style="height: 179px;">',
                            
                        '</ul>',
                    '</div>',
                    '<div class="cby-selected-notice cby-contain-selected">',
                        '<div class="cby-role-list-title" style="border-top: 1px solid #e6e6e6;">',
                            '<input type="checkbox" name="" value="" id="cby-selectd-notice-left">',
                            '<span>已选通知人</span>',
                        '</div>',
                        '<ul class="cby-role-list-selected cby-role-list" id="cby-selected-user-notice" style="height: 179px;">',
                            
                        '</ul>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    '   </div>'].join('')
           

        var last;

        var getbasicData = function (defaultCandidateUserList,defaultnoticeUserList,fn) {
            com.getRoleAll({},function(res){
                dataRole = res.list;
                defaultCandidateUserData=defaultCandidateUserList,
                defaultnoticeUserData=defaultnoticeUserList;
                com.refreshBackGround(defaultCandidateUserList,defaultnoticeUserList);
                selectedCandidateData = defaultCandidateUserData;
                selectedNoticeData = defaultnoticeUserData;
               
                last = returnData;
                function returnData() {
                    fn(selectedCandidateData, selectedNoticeData);
                }
            })
        }

        var com = {
            //渲染弹出层
            refreshBackGround: function (defaultCandidateUserList,defaultnoticeUserList) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        type: 1,
                        // skin: 'layui-layer-molv',
                        title: '选择候选人&通知人',
                        content: Cotent,
                        btn: ['确定', '关闭'],
                        area: ['750px', '600px'],
                        yes: function (index) {
                            // layer.close(index); //关闭当前弹层
                            //util监听事件
                            //var getData = basicData.$transfer.getData('Role') //获得右侧数据
                            //basicData.SelectedUserData = getData;
                            last();
                            layer.close(index); //关闭当前弹层
                        },
                    });
                    $("#cby-role-lists").html($com.util.template(dataRole, HTML.AllRoleListNode));
                    $("#cby-selected-user-candidate").html($com.util.template(defaultCandidateUserList, HTML.CandidateUserListNode));
                    $("#cby-selected-user-notice").html($com.util.template(defaultnoticeUserList, HTML.NoticeUserListNode));
                });
            },
            // 获取所有角色
            getRoleAll: function (data, fn, context) {
                var d = {
                    $URI: "/Role/All",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 获得角色人员
            getRoleUser: function (data, fn, context) {
                var d = {
                    $URI: "/Role/UserAll",
                    $TYPE: "get"
                };

                function err() {
                    $com.app.tip('获取失败，请检查网络');
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },
            // 数组去重合并
            getNewArr: function (array1, array2) {
                for (var i = 0; i < array2.length; i++) {
                    for (var j = 0; j < array1.length; j++) {
                        if (array2[i].ID == array1[j].ID) {
                            array1.splice(j, 1);
                        }
                    }
                }
                var newArr = array1.concat(array2);
                return newArr;
            }
        }
        // 显示待选人员列表
        $("body").delegate("#cby-role-lists li", "click", function () {
            var roleID = $(this).attr("data-value");
            com.getRoleUser({ role_id: roleID }, function (res) {
                var allUserList = res.list,
                    _allUserList = [],
                    userObj = {};
                $.each(allUserList, function (i, item) {
                    _allUserList.push(userObj = {
                        ID: item.FunctionID,
                        Name: item.Text
                    })
                })
                $("#cby-select-user").html($com.util.template(_allUserList, HTML.UserListNode));
                selectNum = _allUserList.length;
            })
        })
        // 待选人员全选事件
        $("body").delegate("#cby-select-all-left", "change", function () {
            // alert("bbb")
            var leftCheckedArr = [], leftCheckedObj = {};
            if ($(this).prop("checked") == true) {
                $(".cby-role-list-select input").prop("checked", "checked");
                $('.cby-role-list-select input:checkbox:checked').each(function () {
                    leftCheckedObj = {
                        ID: $(this).parent().attr("data-value"),
                        Name: $(this).parent().attr("data-name"),
                    }
                    leftCheckedArr.push(leftCheckedObj);
                });
                $("#cby-candidate-cross-right").removeAttr("disabled");
                $("#cby-candidate-cross-right").addClass("cby-cross-center-contain-button-active");

                $("#cby-notice-cross-right").removeAttr("disabled");
                $("#cby-notice-cross-right").addClass("cby-cross-center-contain-button-active");
            } else {
                $(".cby-role-list-select input").prop("checked", false);
                $("#cby-candidate-cross-right").attr({ "disabled": "disabled" })
                $("#cby-candidate-cross-right").removeClass("cby-cross-center-contain-button-active");

                $("#cby-notice-cross-right").attr({ "disabled": "disabled" })
                $("#cby-notice-cross-right").removeClass("cby-cross-center-contain-button-active");
            }
        })
        // 待选input选择事件
        $("body").delegate(".cby-role-list-select input", "change", function () {
            // alert("bbb")
            var checked = [];
            $('.cby-role-list-select input:checkbox:checked').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });
            if (checked.length >= 1) {
                $("#cby-candidate-cross-right").removeAttr("disabled");
                $("#cby-notice-cross-right").removeAttr("disabled");
                $("#cby-candidate-cross-right").addClass("cby-cross-center-contain-button-active");
                $("#cby-notice-cross-right").addClass("cby-cross-center-contain-button-active");
                if (checked.length == selectNum) {
                    $("#cby-select-all-left").prop("checked", "checked");
                } else {
                    $("#cby-select-all-left").prop("checked", "");
                }
            } else if (checked.length <= 0) {
                $("#cby-candidate-cross-right").attr({ "disabled": "disabled" })
                $("#cby-candidate-cross-right").removeClass("cby-cross-center-contain-button-active");
                $("#cby-notice-cross-right").attr({ "disabled": "disabled" })
                $("#cby-notice-cross-right").removeClass("cby-cross-center-contain-button-active");
                $("#cby-select-all-left").prop("checked", false);
            }
        })

        // 候选人全选事件
        $("body").delegate("#cby-selectd-candidate-left", "change", function () {
            var leftCheckedArr = [], leftCheckedObj = {};
            if ($(this).prop("checked") == true) {
                $("#cby-selected-user-candidate input").prop("checked", "checked");
                $('#cby-selected-user-candidate input:checkbox:checked').each(function () {
                    leftCheckedObj = {
                        ID: $(this).parent().attr("data-value"),
                        Name: $(this).parent().attr("data-name"),
                    }
                    leftCheckedArr.push(leftCheckedObj);
                });
                $("#cby-candidate-cross-left").removeAttr("disabled");
                $("#cby-candidate-cross-left").addClass("cby-cross-center-contain-button-active");
            } else {
                $("#cby-selected-user-candidate input").prop("checked", "");
                $("#cby-candidate-cross-left").attr({ "disabled": "disabled" })
                $("#cby-candidate-cross-left").removeClass("cby-cross-center-contain-button-active");
            }
        })
        // 候选人input选择事件
        $("body").delegate("#cby-selected-user-candidate input", "change", function () {
            var checked = [];
            $('#cby-selected-user-candidate input:checkbox:checked').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });
            if (checked.length >= 1) {
                $("#cby-candidate-cross-left").removeAttr("disabled");
                $("#cby-candidate-cross-left").addClass("cby-cross-center-contain-button-active");
                if (checked.length == selectCandidateNum) {
                    $("#cby-selectd-candidate-left").prop("checked", "checked");
                } else {
                    $("#cby-selectd-candidate-left").prop("checked", "");
                }
            } else if (checked.length <= 0) {
                $("#cby-candidate-cross-left").attr({ "disabled": "disabled" })
                $("#cby-candidate-cross-left").removeClass("cby-cross-center-contain-button-active");
                $("#cby-selectd-candidate-left").prop("checked", false);
            }
        })
        // 候选人右移事件
        $("body").delegate("#cby-candidate-cross-right", "click", function () {
            var checked = [];
            $('.cby-role-list-select input:checkbox:checked').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });
            if (selectedCandidateData.length != 0) {
                var newChecked = com.getNewArr(checked, selectedCandidateData);
            } else {
                newChecked = checked;
            }
            $("#cby-selected-user-candidate").html($com.util.template(newChecked, HTML.CandidateUserListNode));
            selectCandidateNum = newChecked.length;
            selectedCandidateData = newChecked;
            $(".cby-role-list-select input").prop("checked", false);
            $("#cby-select-all-left").prop("checked", "");
            $("#cby-candidate-cross-right").attr({ "disabled": "disabled" })
            $("#cby-candidate-cross-right").removeClass("cby-cross-center-contain-button-active");
            $("#cby-notice-cross-right").attr({ "disabled": "disabled" })
            $("#cby-notice-cross-right").removeClass("cby-cross-center-contain-button-active");
        })
        // 候选人左移事件
        $("body").delegate("#cby-candidate-cross-left", "click", function () {
            var checked = [];
            $('#cby-selected-user-candidate input:not(:checked)').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });

            $("#cby-selected-user-candidate").html($com.util.template(checked, HTML.CandidateUserListNode));
            selectCandidateNum = selectCandidateNum - checked.length;
            selectedCandidateData = checked;
            $("#cby-selectd-candidate-left").prop("checked", false);
            $("#cby-candidate-cross-left").attr({ "disabled": "disabled" })
            $("#cby-candidate-cross-left").removeClass("cby-cross-center-contain-button-active");

        })

        // 通知人全选事件
        $("body").delegate("#cby-selectd-notice-left", "change", function () {
            var leftCheckedArr = [], leftCheckedObj = {};
            if ($(this).prop("checked") == true) {
                $("#cby-selected-user-notice input").prop("checked", "checked");
                $('#cby-selected-user-notice input:checkbox:checked').each(function () {
                    leftCheckedObj = {
                        ID: $(this).parent().attr("data-value"),
                        Name: $(this).parent().attr("data-name"),
                    }
                    leftCheckedArr.push(leftCheckedObj);
                });
                $("#cby-notice-cross-left").removeAttr("disabled");
                $("#cby-notice-cross-left").addClass("cby-cross-center-contain-button-active");
            } else {
                $("#cby-selected-user-notice input").prop("checked", "");
                $("#cby-notice-cross-left").attr({ "disabled": "disabled" })
                $("#cby-notice-cross-left").removeClass("cby-cross-center-contain-button-active");
            }
        })
        // 通知人input选择事件
        $("body").delegate("#cby-selected-user-notice input", "change", function () {
            var checked = [];
            $('#cby-selected-user-notice input:checkbox:checked').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });
            if (checked.length >= 1) {
                $("#cby-notice-cross-left").removeAttr("disabled");
                $("#cby-notice-cross-left").addClass("cby-cross-center-contain-button-active");
                if (checked.length == selectNoticeNum) {
                    $("#cby-selectd-notice-left").prop("checked", "checked");
                } else {
                    $("#cby-selectd-notice-left").prop("checked", "");
                }
            } else if (checked.length <= 0) {
                $("#cby-notice-cross-left").attr({ "disabled": "disabled" })
                $("#cby-notice-cross-left").removeClass("cby-cross-center-contain-button-active");
                $("#cby-selectd-notice-left").prop("checked", false);
            }
        })
        // 通知人右移事件
        $("body").delegate("#cby-notice-cross-right", "click", function () {
            var checked = [];
            $('.cby-role-list-select input:checkbox:checked').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });
            if (selectedNoticeData.length != 0) {
                var newChecked = com.getNewArr(checked, selectedNoticeData);
            } else {
                newChecked = checked;
            }
            $("#cby-selected-user-notice").html($com.util.template(newChecked, HTML.NoticeUserListNode));
            selectNoticeNum = newChecked.length;
            selectedNoticeData = newChecked;
            $(".cby-role-list-select input").prop("checked", false);
            $("#cby-select-all-left").prop("checked", "");
            $("#cby-notice-cross-right").attr({ "disabled": "disabled" })
            $("#cby-notice-cross-right").removeClass("cby-cross-center-contain-button-active");
            $("#cby-candidate-cross-right").attr({ "disabled": "disabled" })
            $("#cby-candidate-cross-right").removeClass("cby-cross-center-contain-button-active");
        })
        // 通知人左移事件
        $("body").delegate("#cby-notice-cross-left", "click", function () {
            var checked = [];
            $('#cby-selected-user-notice input:not(:checked)').each(function () {
                checked.push({
                    ID: $(this).parent().attr("data-value"),
                    Name: $(this).parent().attr("data-name"),
                });
            });

            $("#cby-selected-user-notice").html($com.util.template(checked, HTML.NoticeUserListNode));
            selectNoticeNum = selectNoticeNum - checked.length;
            selectNoticeNum = checked.length;
            selectedNoticeData = checked;
            $("#cby-selectd-notice-left").prop("checked", false);
            $("#cby-notice-cross-left").attr({ "disabled": "disabled" })
            $("#cby-notice-cross-left").removeClass("cby-cross-center-contain-button-active");
        })

        return {
            getbasicData:getbasicData
        };

    });

