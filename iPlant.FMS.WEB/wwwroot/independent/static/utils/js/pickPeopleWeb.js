define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var tool_show, render;
        var array = [];
        var mArrayID_people = [];
        var mArrayID = [];
        var mEmployee = [];
        var newEmployeeList = [];
        var mDepartment = [];
        var firstData = [];
        var SelectArray = [];
        var param = {
            PeopleList: [], //第一层（公司领导下所有部门以及下所有人员）
            DepartmentList: [],//所有部门
            UserList: [],//所有人员(已激活)
            title1: "",  //主标题
            title2: "", //公司部门
            mode: 1,   //1 单选 2多选
        };
        var HTML = {
            contain: ['<div class="view view-wrap" style="padding: 25px 10px;left: 0px;">',
                '</div>'].join(""),
            page: [
                '<div class="m-menu m-blue-menu" style="font-size:16px;width: 100%">',
                '<div class="m-left-area btn" style="width: 20%;display: inline-block;text-align: left;font-size:16px;font-weight: bold;" data-dismiss="modal">',
                '<img src="../static/images/checkbox/返回.png" style="width:20px;height:20px;vertical-align: middle;"><span>返回</span>',
                '</div>',
                '<div class="m-title" style="width: 60%;display: inline-block;text-align: center;font-weight: bold;font-size:16px;">',
                '<span>广州电力机车有限公司</span>',
                '</div>',
                '<div class="m-right-area btn" style="width: 20%;display: inline-block;text-align: right;font-weight: bold;font-size:16px;" data-dismiss="modal">',
                '<img src="../static/images/checkbox/确认.png" style="width:25px;height:25px;vertical-align: middle;"><span class="confirm">确认</span>',
                '</div>',
                '</div>',
                '<div class="m-card" style="padding: 5px 13px;">',
                '<input class="form-control femi-select-input femi-search-content" type="text" placeholder="请输入搜索文本" />',
                '</div>',

                '<div style="padding: 0 13px;max-height: 500px">',
                '<div class="left" style="width: 30%;float: left;">',
                '<div class="m-table" id="Navigation"style="min-height: auto;">',
                '<ul class="mUl" style="padding-left: 0px;">',
                '<li>',
                '<a class="m-btn" href="javascript:;" id="company" style="font-size: 14px;font-weight: bold;">主页</a>',
                '</li>',
                '</ul> ',
                '</div>',
                '<div class="m-table PersonSelection"style="min-height: auto;clear: both;">',
                '<ul class="mPerson" style="padding-left: 0px;">',

                '</ul> ',
                '</div>',
                '</div>',
                '<div class="m-table people right" style="overflow-y: auto;min-height:400px;max-height:500px;border: 1px solid gainsboro;width: 70%;">',
                '<ul class="List_department">',
                '</ul>',
                '<ul class="List_people">',
                '</ul>',
                '</div>',
                '</div>',
            ].join(""),
            module: [
                '<li>',
                '<label style="width: 100%;border-bottom: 1px solid gainsboro;padding: 10px 0px 10px 0px;" class="Label">',
                '<div class="clearfix mList" style="width: 70%;margin-left: 10px;display: inline-block;"  data-value="{{ID}}"> ',
                '<img src="../static/images/checkbox/uncheck.png" style="width:20px;height:20px;float:left" class="uncheck">',
                '<img src="../static/images/checkbox/checked.png" style="width:20px;height:20px;float:left;display: none;" class="checked">',
                '<span style="margin-left: 10px;float:left;font-size: 14px;">{{Name}} ({{EmployeeCount}})<span> ',
                '</div>',
                '<div class="clearfix mList_people" style="margin-right: 10px;width: 20%;display: inline-block; text-align: right;float:right"data-people="{{ID}}"data-name="{{Name}}">',
                // '<div style="width: 2px;height: 20px;background-color: gainsboro;display: inline-block;margin-right: 6px;"></div>',
                '<img src="../static/images/checkbox/subordinate.png" style="width:15px;height:15px;margin-right: 6px;" >',
                '<span style="color: #7abbfc;font-size: 14px;">下级</span>',
                '</div>',
                '</div>',
                '</label>',
                '</li>',
            ].join(""),
            module_people: [
                '<li>',
                '<label style="width: 100%;border-bottom: 1px solid gainsboro;padding: 5px 0px 8px 0px;"class="ms-group1">',
                '<div class="clearfix mList_subordinate" style="width: 95%;margin-left: 10px;display: inline-block;vertical-align: middle;"data-value="{{ID}}">',
                '<img src="../static/images/checkbox/uncheck.png" style="width:20px;height:20px;float: left; margin-top: 5px;" class="uncheck_people">',
                '<img src="../static/images/checkbox/checked.png" style="width:20px;height:20px;display: none;float: left;margin-top: 5px;" class="checked_people">',
                '<div style="line-height: 30px;display: inline-block; width: 30px;height: 30px;border-radius: 15px;background-color: #7abbfc;color: white;',
                'float: left;margin-left: 8px;text-align: center;"><p  style="font-size: 13px;">{{Namecode}}<p></div>',
                '<span style="margin-left: 10px;float: left;margin-top: 5px;font-size: 12px;">{{Name}}{{LoginName}}</span>',
                '</div>',
                '</div>',
                '</label>',
                '</li>',
            ].join(""),
        };

        var tool_show = function (param, fn) {
            mArrayID_people = [];
            SelectArray = [];
            if (param.EchoData) {
                wEchoData = param.EchoData
            } else {
                wEchoData = [];
            }
            wPeople = param.PeopleList;
            wDepartment = param.DepartmentList;
            wUser = param.UserList;
            wMode = param.mode;

            //拿parentID等于0的部门
            firstDepartment = wDepartment.filter(p => p.ParentID == 0 && p.Active == 1);
            //无部门人员
            firstPeople = wUser.filter(p => p.DepartmentID == 0 && p.Active == 1);
            wPeople.DepartmentList = firstDepartment;
            wPeople.EmployeeList = firstPeople;
            firstData = $com.util.Clone(wPeople);
            mArrayID_people = $com.util.Clone(wEchoData);
            var $Contain = $(HTML.contain);
            $Contain.html(HTML.page);

            for (var k = 0; k < mArrayID_people.length; k++) {
                var SelectName = SelectNameDate(mArrayID_people[k]);
                $Contain.find(".left .mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + mArrayID_people[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;"</a></li>');
            }

            render($Contain, wPeople);
            $Contain.delegate(".m-card  input.femi-search-content", "input", function () {
                searchUser = [];
                mEmployeeList = [];
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                wUser.forEach(element => {
                    if (element.Name.indexOf(value) >= 0 && value != "") {
                        searchUser.push(element);
                    }
                });
                if (searchUser.length > 0) {
                    $Contain.find(".List_people").show();
                    $Contain.find(".List_department").hide();
                    for (var i = 0; i < searchUser.length; i++) {
                        searchUser[i].Namecode = searchUser[i].Name.substr(searchUser[i].Name.length - 2, 2);
                        searchUser[i].LoginName = "(" + searchUser[i].LoginID.substr(searchUser[i].LoginID.length - 6, 6) + ")";
                        mEmployeeList.push(searchUser[i]);
                    }
                    $Contain.find(".List_people").html($com.util.template(mEmployeeList, HTML.module_people));
                } else {
                    $Contain.find(".List_people").show();
                    $Contain.find(".List_department").show();
                    render($Contain, firstData);
                }
            });

            $Contain.delegate(".mUl li", "click", function () {
                mDepartment = [];
                mEmployee = [];
                // mArrayID_people = [];
                var $this = $(this);
                var ID = Number($this.find("a").find("p").text());
                $this.nextAll("li").remove();
                if (ID > 0) {
                    refresh(ID);
                    function refresh(mLower) {
                        for (var i = 0; i < wUser.length; i++) {
                            if (mLower == wUser[i].DepartmentID) {
                                mEmployee.push(wUser[i]);
                            }
                        }
                        for (var j = 0; j < wDepartment.length; j++) {
                            if (mLower == wDepartment[j].ParentID) {
                                wDepartment[j].EmployeeCount = getDepAndUserOne(wDepartment[j].ID, wUser, wDepartment);
                                mDepartment.push(wDepartment[j]);
                            }
                        }
                        wPeople = {
                            EmployeeList: mEmployee,
                            DepartmentList: mDepartment
                        };
                        render($Contain, wPeople);
                    }
                }
            });
            $Contain.delegate(".left .mPerson li", "click", function () {
                var $this = $(this);
                var ID = Number($this.find("a").find("p").attr("data-id"));
                for (var i = 0; i < mArrayID_people.length; i++) {
                    if (ID == mArrayID_people[i]) {
                        mArrayID_people.splice(i, 1)
                    }
                }
                $this.remove();
            });

            $Contain.delegate("#company", "click", function () {
                mDepartment = [];
                mEmployee = [];
                // mArrayID_people = [];
                $(".mUl li").not(":first").remove();
                $Contain.find(".List_people").show();
                $Contain.find(".List_department").show();
                render($Contain, firstData);
            });

            $Contain.delegate(".mList_people", "click", function () {
                mDepartment = [];
                mEmployee = [];
                // mArrayID_people = [];
                var $this = $(this),
                    Name = $this.attr("data-name");
                mLower = Number($this.attr("data-people"));
                $Contain.find(".mUl").append('<li><a class="m-btn" style="font-size: 14px;" href="javascript:;" >' + ">" + Name + "<p  style='display: none'; id='index'>" + mLower + "</p>" + '</a></li>');
                for (var i = 0; i < wUser.length; i++) {
                    if (mLower == wUser[i].DepartmentID) {
                        mEmployee.push(wUser[i]);
                    }
                }
                for (var j = 0; j < wDepartment.length; j++) {
                    if (mLower == wDepartment[j].ParentID) {
                        wDepartment[j].EmployeeCount = getDepAndUserOne(wDepartment[j].ID, wUser, wDepartment);
                        mDepartment.push(wDepartment[j]);
                    }
                }
                wPeople = {
                    EmployeeList: mEmployee,
                    DepartmentList: mDepartment,
                };
                render($Contain, wPeople);
            });

            function getDepAndUser(id, UserList, DepList, num) {

                //该部门下人数；
                for (var i = 0; i < UserList.length; i++) {
                    if (id == UserList[i].DepartmentID) {
                        num += 1;
                    }
                }
                //查找子部门的人数
                for (var k = 0; k < DepList.length; k++) {
                    if (id == DepList[k].ParentID) {

                        var _Item = getDepAndUser(DepList[k].ID, UserList, DepList, num);

                    }

                }

                return num;
            };
            $Contain.delegate(".mList", "click", function () {
                var $this = $(this);
                mID = Number($this.attr("data-value"));
                mArrayID.push(mID);
                var img_uncheck = $this.find("img")[0];
                var img_checked = $this.find("img")[1];
                var show_uncheck = $(img_uncheck).css('display');
                if (show_uncheck == 'block') {
                    $(img_uncheck).css('display', 'none');
                }
                if (show_uncheck == 'none') {
                    $(img_uncheck).css('display', 'block');
                }
                var show_checked = $(img_checked).css('display');
                if (show_checked == 'block') {
                    $(img_checked).css('display', 'none');
                }
                if (show_checked == 'none') {
                    $(img_checked).css('display', 'block');
                    $this.parents("li").siblings().find(".Label .mList .uncheck").show();
                    $this.parents("li").siblings().find(".Label .mList .checked").hide();
                }
            });
            $Contain.delegate(".mList_subordinate", "click", function () {
                var $this = $(this);
                //多选
                if (wMode == 2) {
                    mID_people = Number($this.attr("data-value"));
                    mArrayID_people.push(mID_people);
                    mArrayID_people = arryOnea(mArrayID_people);
                    $this.parents(".people").siblings(".left").find(".PersonSelection .mPerson li").remove();
                    for (var k = 0; k < mArrayID_people.length; k++) {
                        var SelectName = SelectNameDate(mArrayID_people[k]);
                        $Contain.find(".mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + mArrayID_people[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;"</a></li>');
                    }

                    var img_uncheck_people = $this.find("img")[0];
                    var img_checked_people = $this.find("img")[1];
                    var show_uncheck_people = $(img_uncheck_people).css('display');
                    if (show_uncheck_people == 'block') {
                        $(img_uncheck_people).css('display', 'none');
                        // $(".uncheck_people").show();
                    }
                    if (show_uncheck_people == 'none') {
                        $(img_uncheck_people).css('display', 'block');
                    }
                    var show_checked_people = $(img_checked_people).css('display');
                    if (show_checked_people == 'block') {
                        $(img_checked_people).css('display', 'none');
                    }
                    if (show_checked_people == 'none') {
                        $(img_checked_people).css('display', 'block');
                    }
                }
                //单选
                if (wMode == 1) {
                    mArrayID_people = [];
                    mID_people = Number($this.attr("data-value"));
                    mArrayID_people.push(mID_people);

                    mArrayID_people = arryOnea(mArrayID_people);
                    $this.parents(".people").siblings(".left").find(".PersonSelection .mPerson li").remove();
                    for (var k = 0; k < mArrayID_people.length; k++) {
                        var SelectName = SelectNameDate(mArrayID_people[k]);
                        $Contain.find(".mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + mArrayID_people[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;"</a></li>');
                    }

                    var img_uncheck_people = $this.find("img")[0];
                    var img_checked_people = $this.find("img")[1];
                    var show_uncheck_people = $(img_uncheck_people).css('display');
                    if (show_uncheck_people == 'block') {
                        $(img_uncheck_people).css('display', 'none');
                        // $(".uncheck_people").show();
                    }
                    if (show_uncheck_people == 'none') {
                        $(img_uncheck_people).css('display', 'block');
                    }
                    var show_checked_people = $(img_checked_people).css('display');
                    if (show_checked_people == 'block') {
                        $(img_checked_people).css('display', 'none');
                    }
                    if (show_checked_people == 'none') {
                        $(img_checked_people).css('display', 'block');
                        $this.parents("li").siblings().find(".ms-group1 .mList_subordinate .uncheck_people").show();
                        $this.parents("li").siblings().find(".ms-group1 .mList_subordinate .checked_people").hide();
                    }
                }


            });
            $Contain.delegate(".m-right-area", "click", function () {
                mNameList = [];
                if (fn) {
                    //模板
                    var structure = {
                        ID: 0,
                        Name: "",
                        DepartmentID: 0,
                        DepartmentName: "",
                    }
                    for (var i = 0; i < mArrayID_people.length; i++) {
                        mNameList.push(personnel(mArrayID_people[i]));
                    }

                    fn(mNameList);
                    close();
                }
            });
            $Contain.delegate(".m-left-area", "click", function () {
                close();

            });
            $(".modal-body").html("")
            $(".modal-body").append($Contain);
            setTimeout(function () {
                $Contain.css("left", 0);
            }, 100);

            function close() {
                $Contain.css("left", "100%");
                $Contain.find(".m-right-area .confirm").off("click");
                setTimeout(function () {
                    $Contain.remove();
                }, 1000);
            }

            function personnel(mID) {
                for (var j = 0; j < wUser.length; j++) {
                    if (mID == wUser[j].ID) {
                        structure = {
                            ID: wUser[j].ID,
                            Name: wUser[j].Name,
                            DepartmentID: wUser[j].DepartmentID,
                            DepartmentName: wUser[j].Department,
                        }
                    }
                }
                return structure;
            }
            function SelectNameDate(mID) {
                var Name = "";
                for (var i = 0; i < wUser.length; i++) {
                    if (wUser[i].ID == mID) {
                        Name = wUser[i].Name;
                    }
                }
                return Name;
            }
            function arryOnea(data) {
                var temp = {};
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (!temp[data[i]]) {
                        temp[data[i]] = "abc";
                        arr.push(data[i]);
                    }
                }
                return arr;
            }
        };
        var render = function ($Contain, wData) {
            var mEmployeeList = [];
            for (var i = 0; i < wData.EmployeeList.length; i++) {
                wData.EmployeeList[i].Namecode = wData.EmployeeList[i].Name.substr(wData.EmployeeList[i].Name.length - 2, 2);
                wData.EmployeeList[i].LoginName = "(" + wData.EmployeeList[i].LoginID.substr(wData.EmployeeList[i].LoginID.length - 6, 6) + ")";
                mEmployeeList.push(wData.EmployeeList[i]);
            }
            $Contain.find(".List_people").html($com.util.template(mEmployeeList, HTML.module_people));


            wData.DepartmentList.forEach(element => {
                element.EmployeeCount = getDepAndUserOne(element.ID, wUser, wDepartment);
            });


            $Contain.find(".List_department").html($com.util.template(wData.DepartmentList, HTML.module));

        };

        function getDepAndUserOne(wDepartmentID, wAllUserList, wAllDepartmentList) {
            var wResult = 0;

            //找到该部门下所有人，并添加
            var wNum = wAllUserList.filter(p => p.DepartmentID == wDepartmentID).length;
            wResult += wNum;
            //找到该部门下的所有部门
            var wDeps = wAllDepartmentList.filter(p => p.ParentID == wDepartmentID);
            if (wDeps.length <= 0) {
                return wResult;
            }
            //遍历所有子部门，添加所有子部门下的人员
            wDeps.forEach(element => {
                wResult += getDepAndUserOne(element.ID, wAllUserList, wAllDepartmentList);
            });

            return wResult;
        };

        var people = {
            show: tool_show,
        };
        return people
    }); 