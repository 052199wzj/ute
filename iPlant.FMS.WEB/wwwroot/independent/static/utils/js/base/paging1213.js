define(['../jquery-3.1.1', './base'], function ($jq,$com) {
    var COUNTS = 0,//table总数据数
        PAGES,//分页总共多少页
        NOWPAGE = 1,
        TURNPAGE = 0,
        OnePageConut = 10,
        List,
        $Table,
        $TableTemplate,
        _List,
        $p_flag,
        count = 1;

    var pageTemplate = [
        '<div class="cby-paging-body">',
        '<ul class="cby-paging">',
        '<li class="cby-first-page"><img src="../static/images/pageTest/first.png" alt="" /></li>',
        '<li class="cby-front-page"><button class="">上一页</button></li>',
        '<li class="">|</li>',
        '<li class="cby-all-list">共<input type="text" name="" value="{{COUNTS}}" disabled="disabled" />条数据</li>',
        '<li class="cby-now-page">第<input type="text" name="" value="{{NOWPAGE}}" disabled="disabled" />页</li>',
        '<li class="cby-all-page">共<input type="text" name="" value="{{PAGES}}" disabled="disabled" />页</li>',
        '<li ><span class="cby-change-page">跳转到</span><input class="change-input" type="text" name="" value="{{TURNPAGE}}" style="padding-top:1px;" />页</li>',
        '<li ><span class="cby-change-onepage">当前数据</span><input class="nowpage-input" type="text" name="" value="{{OnePageConut}}" style="padding-top:1px;"/>条</li>',
        '<li class="">|</li>',
        '<li class="cby-next-page"><button class="">下一页</button></li>',
        '<li class="cby-last-page"><img src="../static/images/pageTest/last.png" alt="" /></li>',
        '</ul>',
        '</div>'
    ].join("");

    //获取新的分页list
    var getPage = function (list, $table, TableTemplate, farClass, p_flag) {
        List = list;
        $Table = $table,
        $TableTemplate = TableTemplate,
        $p_flag = p_flag,
        COUNTS = list.length,
        $FarClass = farClass;
        PAGES = Math.ceil(COUNTS / OnePageConut);
        //1 判断当前数据有多少条，是否需要插入分页
        if (COUNTS>=OnePageConut) {
            var beginPageNum = 0,
                endPageNum=0;
            //判断当前页是否超过范围
            if (NOWPAGE>=1 && NOWPAGE <= PAGES) {
                beginPageNum = (NOWPAGE - 1) * OnePageConut;
                endPageNum = beginPageNum + (OnePageConut - 1) + 1;
            }
           
            //截取当前页的数据      
            var newList = list.slice(beginPageNum, endPageNum);
            refreshPage(newList, $table, TableTemplate,farClass);
           
           
        } else {
            var flag = $($Table).find(".cby-paging-body");
            if (flag) {
                $(".cby-paging-body").remove();
            }
            $($table).html($com.util.template(list, TableTemplate));
        }
    }

    //刷新分页页面
    var refreshPage = function (list, $Table, $TableTemplate, farClass) {   
        var showPage = [],
        showPageObj = {};
        showPageObj.NOWPAGE = NOWPAGE;
        showPageObj.PAGES = PAGES;
        showPageObj.TURNPAGE = TURNPAGE;
        showPageObj.OnePageConut = OnePageConut;
        showPageObj.COUNTS = COUNTS;
        showPage.push(showPageObj);
        $com.util.template(showPage, pageTemplate);


        //判断原始有无分页
        var flag = $($Table).find(".cby-paging-body");
        if (flag) {
            $(".cby-paging-body").remove();
        }
        //将渲染的分页添加到原页面中
        $(farClass).append(pageTemplate);
        //渲染分页
        $(".cby-paging-body").html($com.util.template(showPage, pageTemplate));

        //渲染新的table
        $($Table).html($com.util.template(list, $TableTemplate));
      
    }
    //模糊查询渲染页面
    var getSearchList = function (searchCondition) {
        if (count == 1 && typeof $p_flag === "undefined") {
            _List = List;
        }
        else if ($p_flag == true) {
            _List = List;
            $p_flag = false;
        } else if (($p_flag == false && typeof _List === "undefined")) {
            _List = List;
        }
        if (searchCondition == undefined || searchCondition == "" || searchCondition.trim().length < 1)
            getPage(_List, $Table, $TableTemplate, $FarClass);

        else
            //1 筛选出符合的数据
            var newList = [],valueList = [];
            $.each(_List, function (i, item) {
                //获取item对象的所有属性值
                for (var n in item) {
                    if (item[n] != "")
                        valueList.push(item[n]);
                }
                valueList = valueList.slice(1);
				//找到list中匹配的项
				$.each(valueList, function (v_i, v_item) {
					if ($.isNumeric(v_item)) {
						v_item = v_item.toString();
					}
					if (typeof (v_item) != "object"&& typeof (v_item) != "null" &&typeof (v_item) != "undefined") {
					    if ((v_item.match(searchCondition)) != null) {
					        newList.push(item);
					        valueList = [];
						    return false;
					    }
					}
				});
            });
			

            //2 保存初始的状态数据
            var _OnePageConut = OnePageConut;
            //获取当前新table的分页数据
            var newOnePageConut = 10;
            NOWPAGE = 1;
            COUNTS = newList.length;
            PAGES = Math.ceil(COUNTS / newOnePageConut);
            TURNPAGE = 0;
            getPage(newList, $Table, $TableTemplate, $FarClass);
            count++;
    }

    //上一页
    $("body").delegate(".cby-front-page", "click", function () {
        NOWPAGE--;
        if (NOWPAGE <1) {
            alert("已经是第一页了！！！")
        } else {
            getPage(List,$Table, $TableTemplate, $FarClass);
        }
    });
    //下一页
    $("body").delegate(".cby-next-page", "click", function () {
        NOWPAGE++;
        if (NOWPAGE > PAGES) {
            alert("已经是最后一页了！！！")
        } else {
            getPage(List,$Table, $TableTemplate, $FarClass);
        }
        
    });

    //首页
    $("body").delegate(".cby-first-page", "click", function () {
        if (NOWPAGE == 1) {
            alert("已经是第一页了！！！");
        } else {
            NOWPAGE = 1;
            getPage(List,$Table, $TableTemplate, $FarClass);
        }
       
    });
    //尾页
    $("body").delegate(".cby-last-page", "click", function () {
        if (NOWPAGE == PAGES) {
            alert("已经是最后一页了！！！");
        } else {
            NOWPAGE = PAGES;
            getPage(List,$Table, $TableTemplate, $FarClass);
        }
        
    });
    //跳转指定页
    $("body").delegate(".change-input", "change", function () {
        var val = $(this).val();
        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        //调用方法验证字符串是否匹配
        var flag = reg.test(val);
        if (flag) {
            if (val >= 1 & val <= PAGES) {
                NOWPAGE = Number(val);
                TURNPAGE = Number(val);
                getPage(List, $Table, $TableTemplate, $FarClass);
            } else {
                alert("请选择正确页数！！！");
            }
        } else {
            alert("只能输入数字！！！")
        }
    });
    //更改每页条数
    $("body").delegate(".nowpage-input", "change", function () {
        var val = $(this).val();
        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        //调用方法验证字符串是否匹配
        var flag = reg.test(val);
        if (flag) {
            if (Number(val)> List.length){
                alert("当前页最大数据为" + COUNTS + "条！！！");
            }
            else {
                OnePageConut = Number(val);
                NOWPAGE = 1;
                getPage(List, $Table, $TableTemplate, $FarClass);   
            }
        } else {
            alert("只能输入数字！！！")
        }
       
    });

    return {
        getPage: getPage,
        getSearchList: getSearchList
    }
}); 