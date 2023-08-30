define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var tool_show, render;
        var wDepartment = [];
        var DepartmentValue = [];
        var param = {
            DepartmentList: [],//所有部门
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

                '<div style="padding: 0 13px;">',
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
                '<div class="m-table people right" style="overflow-y: auto;min-height:400px ;max-height:600px;border: 1px solid gainsboro;width: 70%;">',
                '<ul class="List_department">',
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
                '<div class="clearfix searchSubordinate" style="margin-right: 10px;width: 20%;display: inline-block; text-align: right;float:right"data-department="{{ID}}"data-name="{{Name}}">',
                // '<div style="width: 2px;height: 20px;background-color: gainsboro;display: inline-block;margin-right: 6px;"></div>',
                '<img src="../static/images/checkbox/subordinate.png" style="width:15px;height:15px;margin-right: 6px;" >',
                '<span style="color: #7abbfc;font-size: 14px;font-weight: bold;">下级</span>',
                '</div>',
                '</div>',
                '</label>',
                '</li>',
            ].join(""),
            SelectDepartment: [
                '<li>',
                '<label style="width: 100%;border-bottom: 1px solid gainsboro;padding: 10px 0px 10px 0px;" class="Label">',
                '<div class="clearfix mList" style="width: 96%;margin-left: 10px;display: inline-block;"  data-value="{{ID}}"> ',
                '<img src="../static/images/checkbox/uncheck.png" style="width:20px;height:20px;float:left" class="uncheck">',
                '<img src="../static/images/checkbox/checked.png" style="width:20px;height:20px;float:left;display: none;" class="checked">',
                '<span style="margin-left: 10px;float:left;font-size: 14px;">{{Name}}<span> ',
                '</div>',
                '</div>',
                '</label>',
                '</li>',
            ].join(""),
        };

        var tool_show = function (param, fn) {
            //获取回显值
            if (param.EchoData) {
                wEchoData = param.EchoData
            } else {
                wEchoData = [];
            }
            //获取传进来的参数值
            wDepartment = param.DepartmentList;
            wMode = param.mode;
            //拿parentID等于0的部门即父级部门
            firstDepartment = wDepartment.filter(p => p.ParentID == 0 && p.Active == 1);
            //全局渲染值
            RenderDepartment = $com.util.Clone(firstDepartment);
            //将回显值给全局变量的值
            DepartmentValue = $com.util.Clone(wEchoData);
            var $Contain = $(HTML.contain);
            $Contain.html(HTML.page);
            //将默认数据显示到界面
            for (var k = 0; k < DepartmentValue.length; k++) {
                var SelectName = SelectNameDate(DepartmentValue[k]);
                $Contain.find(".left .mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + DepartmentValue[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;margin-top: 8px;"</a></li>');
            }
            render($Contain, RenderDepartment);
            //模糊查询查部门
            $Contain.delegate(".m-card  input.femi-search-content", "input", function () {
                searchDepartment = [];
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                wDepartment.forEach(element => {
                    if (element.Name.indexOf(value) >= 0 && value != "") {
                        searchDepartment.push(element);
                    }
                });
                if (searchDepartment.length > 0) {
                    $Contain.find(".List_department").show();
                    $Contain.find(".List_department").html($com.util.template(searchDepartment, HTML.SelectDepartment));
                } else {
                    $Contain.find(".List_department").show();
                    render($Contain, firstDepartment);
                }
            });
            //初始化数据 点击主页
            $Contain.delegate("#company", "click", function () {
                mDepartment = [];
                $(".mUl li").not(":first").remove();
                $Contain.find(".List_department").show();
                render($Contain, firstDepartment);
            });
            //勾选部门
            $Contain.delegate(".mList", "click", function () {
                var $this = $(this);
                //单选
                if (wMode == 1) {
                    DepartmentValue = [];
                    var mID = Number($this.attr("data-value"));
                    DepartmentValue.push(mID);
                    DepartmentValue = arryOnea(DepartmentValue);
                    $this.parents(".people").siblings(".left").find(".PersonSelection .mPerson li").remove();
                    for (var k = 0; k < DepartmentValue.length; k++) {
                        var SelectName = SelectNameDate(DepartmentValue[k]);
                        $Contain.find(".mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;float: left;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + DepartmentValue[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;margin-top: 8px;"</a></li>');
                    }
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
                } else if (wMode == 2) {
                    var mID = Number($this.attr("data-value"));
                    DepartmentValue.push(mID);
                    DepartmentValue = arryOnea(DepartmentValue);
                    $this.parents(".people").siblings(".left").find(".PersonSelection .mPerson li").remove();
                    for (var k = 0; k < DepartmentValue.length; k++) {
                        var SelectName = SelectNameDate(DepartmentValue[k]);
                        $Contain.find(".mPerson").append('<li><a class="m-btn" href="javascript:;" ><p style="font-size:14px;display: inline-block;float: left;margin-bottom: 5px;margin-top: 5px;" id="selectIndex" data-id=' + DepartmentValue[k] + '>' + SelectName + '</p><img src="../static/images/checkbox/error.png" style="width:15px;height:15px;margin-top: 8px;"</a></li>');
                    }
                    var img_uncheck_people = $this.find("img")[0];
                    var img_checked_people = $this.find("img")[1];
                    var show_uncheck_people = $(img_uncheck_people).css('display');
                    if (show_uncheck_people == 'block') {
                        $(img_uncheck_people).css('display', 'none');
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
            });
            //查看下级
            $Contain.delegate(".searchSubordinate", "click", function () {
                mDepartment = [];
                var $this = $(this),
                    Name = $this.attr("data-name");
                DepartmentID = Number($this.attr("data-department"));
                $Contain.find(".mUl").append('<li><a class="m-btn" style="font-size: 14px;" href="javascript:;" >' + ">" + Name + "<p  style='display: none'; id='index'>" + DepartmentID + "</p>" + '</a></li>');

                for (var j = 0; j < wDepartment.length; j++) {
                    if (DepartmentID == wDepartment[j].ParentID) {
                        wDepartment[j].EmployeeCount = getDepAndUserOne(wDepartment[j].ID, wUser, wDepartment);
                        mDepartment.push(wDepartment[j]);
                    }
                }
                RenderDepartment = $com.util.Clone(mDepartment);
                render($Contain, RenderDepartment);
            });
            //删除选中的部门
            $Contain.delegate(".left .mPerson li", "click", function () {
                var $this = $(this);
                var ID = Number($this.find("a").find("p").attr("data-id"));
                for (var i = 0; i < DepartmentValue.length; i++) {
                    if (ID == DepartmentValue[i]) {
                        DepartmentValue.splice(i, 1)
                    }
                }
                $this.remove();
            });
            //返回选择的部门
            $Contain.delegate(".mUl li", "click", function () {
                mDepartment = [];
                var $this = $(this);
                var ID = Number($this.find("a").find("p").text());
                $this.nextAll("li").remove();
                if (ID > 0) {
                    refresh(ID);
                    function refresh(ID) {
                        for (var j = 0; j < wDepartment.length; j++) {
                            if (ID == wDepartment[j].ParentID) {
                                wDepartment[j].EmployeeCount = getDepAndUserOne(wDepartment[j].ID, wUser, wDepartment);
                                mDepartment.push(wDepartment[j]);
                            }
                        }
                        RenderDepartment = $com.util.Clone(mDepartment);
                        render($Contain, RenderDepartment);
                    }
                }
            });
            //提交渲染的数据
            $Contain.delegate(".m-right-area", "click", function () {
                mNameList = [];
                if (fn) {
                    //模板
                    var structure = {
                        DepartmentID: 0,
                        DepartmentName: "",
                    }
                    for (var i = 0; i < DepartmentValue.length; i++) {
                        mNameList.push(personnel(DepartmentValue[i]));
                    }

                    fn(mNameList);
                    close();
                }
            });
            $(".modal-bodyDepartment").html("")
            $(".modal-bodyDepartment").append($Contain);
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
        };
        var render = function ($Contain, wData) {
            wData.forEach(element => {
                element.EmployeeCount = getDepAndUserOne(element.ID, wDepartment);
            });
            $Contain.find(".List_department").html($com.util.template(wData, HTML.module));
        };
        function personnel(mID) {
            for (var j = 0; j < wDepartment.length; j++) {
                if (mID == wDepartment[j].ID) {
                    structure = {
                        DepartmentID: wDepartment[j].ID,
                        DepartmentName: wDepartment[j].Name,
                    }
                }
            }
            return structure;
        }
        //查询部门的名称
        function SelectNameDate(mID) {
            var Name = "";
            for (var i = 0; i < wDepartment.length; i++) {
                if (wDepartment[i].ID == mID) {
                    Name = wDepartment[i].Name;
                }
            }
            return Name;
        }
        //去重
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
        //找部门个数
        function getDepAndUserOne(wDepartmentID, wAllDepartmentList) {
            //找到该部门下的所有部门
            var wDeps = wAllDepartmentList.filter(p => p.ParentID == wDepartmentID);
            if (wDeps.length <= 0) {
                return wResult = 0;
            } else {
                return wResult = wDeps.length;
            }
        };

        var department = {
            show: tool_show,
        };
        return department
    }); 