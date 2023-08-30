define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var tool_show, render;
        var wDateValue = [];
        var param = {
            EchoData: [],//回显数据
            DateList: [],//数据源
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
                '<span class="DateTitle">广州电力机车有限公司</span>',
                '</div>',
                '<div class="m-right-area btn" style="width: 20%;display: inline-block;text-align: right;font-weight: bold;font-size:16px;">',
                '<img src="../static/images/checkbox/确认.png" style="width:25px;height:25px;vertical-align: middle;"><span class="confirmSelect">确认</span>',
                '</div>',
                '</div>',
                '<div class="m-card" style="padding: 5px 13px;">',
                '<input class="form-control femi-select-input femi-search-content" type="text" placeholder="请输入搜索文本" />',
                '</div>',

                '<div style="padding: 0 13px;overflow-y: auto;">',
                '<ul class="SelectDate" style="max-height: 500px;min-height: 300px;">',

                '</ul>',
                '</div>',
            ].join(""),
            SelectLI: [
                '<li>',
                '<label style="width: 100%;border-bottom: 1px solid gainsboro;padding: 10px 0px 10px 0px;" class="Label" data-id={{ID}}>',
                '<div class="clearfix SelectDIV" style="width: 95%;margin-left: 10px;display: inline-block;vertical-align: middle;" data-value={{ID}}>',
                '<img src="../static/images/checkbox/uncheck.png" style="width:25px;height:25px;float: left;" class="uncheck">',
                '<img src="../static/images/checkbox/checked.png" style="width:25px;height:25px;display: none;float: left;" class="checked">',
                '<span style="margin-left: 10px;float: left;font-size: 16px;">{{Name}}</span>',
                '</div>',
                '</label>',
                '</li>',
            ].join(""),
        };

        var tool_show = function (param, fn) {
            wDateValue = [];
            //获取回显值
            if (param.EchoData) {
                wEchoData = param.EchoData
            } else {
                wEchoData = [];
            }
            //获取传进来的参数值
            wDateList = param.DateList;
            wDateListClone = $com.util.Clone(wDateList);
            wMode = param.mode;
            var $Contain = $(HTML.contain);
            $Contain.html(HTML.page);
            render($Contain, wDateList);
            $Contain.find(".SelectDate li label .SelectDIV").each(function (i, item) {
                $item = $(item);
                var Value = $item.attr("data-value");
                if (wEchoData.length > 0) {
                    for (var m = 0; m < wEchoData.length; m++) {
                        if (Value == wEchoData[m]) {
                            $item.find(".uncheck").hide();
                            $item.find(".checked").show();
                            wDateValue.push(wEchoData[m]);
                        }
                    }
                }
            });
            //模糊查询数据
            $Contain.delegate(".m-card  input.femi-search-content", "input", function () {
                TopSearchData = [];
                //模糊查询
                var $this = $(this),
                    value = $this.val();
                wDateListClone.forEach(element => {
                    if (element.Name.indexOf(value) >= 0 && value != "") {
                        TopSearchData.push(element);
                    }
                });
                if (TopSearchData.length > 0) {
                    $Contain.find(".SelectDate").html($com.util.template(TopSearchData, HTML.SelectLI));
                } else {
                    render($Contain, wDateList);
                }
            });

            //选择数据
            $Contain.delegate(".SelectDIV", "click", function () {
                var $this = $(this);
                //单选
                if (wMode == 1) {
                    DepartmentValue = [];
                    var mID = Number($this.attr("data-value"));
                    wDateValue = [];
                    wDateValue.push(mID);
                    wDateValue = arryOnea(wDateValue);

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
                        $this.parents("li").siblings().find(".Label .SelectDIV .uncheck").show();
                        $this.parents("li").siblings().find(".Label .SelectDIV .checked").hide();
                    }
                } else if (wMode == 2) {
                    var mID = Number($this.attr("data-value"));
                    wDateValue.push(mID);
                    wDateValue = arryOnea(wDateValue);

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

            //提交渲染的数据
            $Contain.delegate(".m-right-area", "click", function () {
                mNameList = [];
                if (fn) {
                    //模板
                    var structure = {
                        ID: 0,
                        Name: "",
                    }
                    if (wDateValue.length > 0) {
                        for (var i = 0; i < wDateValue.length; i++) {
                            mNameList.push(personnel(wDateValue[i]));
                        }
                    }else{
                        alert("请选择数据！");
                        return false;
                    }
                  
                    fn(mNameList);
                    close();
                }
            });

            $Contain.find(".m-title .DateTitle").text(param.title1);
            $(".modal-bodySelectDate").html("")
            $(".modal-bodySelectDate").append($Contain);

            setTimeout(function () {
                $Contain.css("left", 0);
            }, 100);
            function close() {
                $Contain.css("left", "100%");
                $('#myModalSelectDate').hide();
                $('#myModalSelectDate').attr("data-backdrop", true);
                $('.modal-backdrop').remove();
                setTimeout(function () {
                    $Contain.remove();
                }, 1000);
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
        };
        var render = function ($Contain, wData) {
            $Contain.find(".SelectDate").html($com.util.template(wData, HTML.SelectLI));
        };
        function personnel(mID) {
            for (var j = 0; j < wDateListClone.length; j++) {
                if (mID == wDateListClone[j].ID) {
                    structure = {
                        ID: wDateListClone[j].ID,
                        Name: wDateListClone[j].Name,
                    }
                }
            }
            return structure;
        }
        var DateListShow = {
            show: tool_show,
        };
        return DateListShow
    });