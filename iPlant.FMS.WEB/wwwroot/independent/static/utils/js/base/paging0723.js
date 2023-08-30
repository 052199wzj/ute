define(['../jquery-3.1.1', './base'], function ($jq, $com) {

    var mPageSize = 20;
    var mPageSizeMin = 10;
    var mPageSizeMax = 100;
    var pageTemplate = [
        '<div class="cby-paging-body" style="text-align: center;">',
        '<ul class="cby-paging">',

        // '<li class="cby-front-page"><button class="">上一页</button></li>',
        '<li style="height:30px;    color: #5D5E5E;">',
        '<select id="cby-select-onepage" name="page" style="width:45px;height:25px;border-radius: 5px;">',
        '<option data-value=20 value ="20">20</option>',
        '<option data-value=30 value ="30">30</option>',
        '<option data-value=40 value ="40">40</option>',
        '</select>',
        '<span>条/页</span>',
        '<li class="cby-prv-page tofirst"><span><i class="glyphicon glyphicon-chevron-left"></i></span></li>',
        '</li>',
        '<li class="lmvt-pagebody" style="height: 30px;margin: 0px;">',
        '<ul class="cby-paging cby-page-number" style="padding:0px;">',

        '</ul>',
        '</li>',
        '<li class="cby-next-page tolast"><span><i class="glyphicon glyphicon-chevron-right"></i></span></li>',
        // '<li class="">|</li>',<img src="../static/images/pageTest/last.png" alt="" />
        // '<li class="cby-all-list">共<input type="text" name="" value="{{COUNTS}}" disabled="disabled" />条数据</li>',
        // '<li class="cby-now-page">第<input type="text" name="" value="{{NOWPAGE}}" disabled="disabled" />页</li>',
        // '<li class="cby-all-page">共<input type="text" name="" value="{{PAGES}}" disabled="disabled" />页</li>',
        '<li style="margin-left:10px;    color: #5D5E5E;">',
        '<span class="cby-change-page">跳至</span>',
        '<input class="change-input" type="number" name="" min="0"  value="0" style="padding-top:1px;" />',
        '<span class="cby-pages"></span>',
        '</li>',

        // '<li ><span class="cby-change-onepage">每页显示</span><input class="nowpage-input" type="text" name="" value="{{OnePageConut}}" style="padding-top:1px;"/>条</li>',
        // '<li class="">|</li>',
        // '<li class="cby-next-page"><button class="">下一页</button></li>',

        '</ul>',
        '</div>'
    ].join("");


    var refreshPage_Local_Init = function (Data, fn, fn_Page) {

        return function (PageSize, PageIndex) {
            var _resData = Data.slice((PageIndex - 1) * PageSize, PageSize * PageIndex);
            var _PageCount = Data.length / PageSize;
            //_PageCount=_Data.length/PageSize+((_Data.length%PageSize>0)?1:0);
            _PageCount = Math.ceil(_PageCount);
            fn_Page(_PageCount, PageIndex, PageSize);
            fn(_resData);
        };
    };
    var refreshPage_remote_Init = function (parms, fn, fn_Page) {

        return function (PageSize, PageIndex) {
            GetRemoteData(parms, function (res) {
                var _PageCount = 0;
                if (parms.PageCountProp) {
                    _PageCount = res[parms.PageCountProp];
                } else {
                    _PageCount = res.info;
                }
                var _resData = [];
                if (parms.DataListProp) {
                    _resData = res[parms.DataListProp];
                } else {
                    _resData = res.list;
                }
                fn_Page(_PageCount, PageIndex, PageSize);
                fn(_resData);
            });
        };
    };
    var GetTableFootData = function ($table_foot) {
        var _resut = {
            PageIndex: $table_foot[0].mPageIndex,
            PageCount: $table_foot[0].mPageCount,
            PageSize: $table_foot[0].mPageSize
        };

        return _resut;
    };

    //组
    var GetRemoteData = function (data, fn, context) {
        var d = {
            //$URI: "/HomePage/GroupUpdate",
            //$SERVER:;
            $TYPE: "get"
        };

        function err() {
            $com.app.tip('获取失败，请检查网络');
        }

        $com.app.ajax($.extend(d, data), fn, err, context);
    };
    //修改子


    //  $Table启用分页的表格
    //  url 远程分页为服务连接 本地分页为原始数据 
    //  parms 分页需要的参数 PageIndex当前页数 pageSize总页数 $SERVER  $URI   PageCountProp   DataListProp
    //  回调函数
    var init = function ($Table, Data, parms, fn) {

        if (!$Table || !$Table[0])
            return;

        $Table = $($Table[0])

        if (!fn)
            return;

        var $table_foot;
        var refeshPageCount = function (PageCount, PageIndex, PageSize) {

            $table_foot[0].mPageIndex = PageIndex;
            $table_foot[0].mPageCount = PageCount;
            $table_foot[0].mPageSize = PageSize;
            //刷新你的分页控件的显示
            PageCount = Number(PageCount);
            PageIndex = Number(PageIndex);
            PageSize = Number(PageSize);

            //总页数$(".cby-pages").html("/" + PAGES + "页");
            $table_foot.find(".cby-pages").html("/" + PageCount + "页");

            var PageBody = $table_foot.find(".cby-page-number");
            var str = "";


            if (PageCount <= 10) {
                for (i = 1; i <= PageCount; i++) {
                    str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                }
            } else if (PageIndex > 5 && PageCount - PageIndex > 5) {

                str = '<li class="cby-number-show" style=""><span data-value="1">1</span></li>';

                str += '<li class="cby-off-show"><span class="cby-off-click">......</span></li>';

                for (i = PageIndex - 3; i <= PageIndex + 3; i++) {
                    str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                }

                // if(PageIndex-1<=5){
                //     for (i = 2; i <= PageIndex; i++) {
                //         str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                //     }
                // }else{
                //     str += '<li class="cby-off-show"><span class="cby-off-click">......</span></li>';
                //     for (i = PageIndex-6; i <= PageIndex+ 5; i++) {
                //         str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                //     }
                // }

                // for (i = PageIndex - 3; i <= PageIndex + 5; i++) {
                //     str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'

                // }

                str += '<li class="cby-off-show"><span class="cby-off-click">......</span></li>';

                // for (i = PageCount-6; i <= PageCount; i++) {
                //     str += '<li class="cby-number-show"><span class="" data-value="' + i + '">' + i + '</span></li>';
                // }

                str += ["<li class=\"cby-number-show\"><span data-value=", PageCount, ">", PageCount, "</span></li>"].join("");
            } else if (PageIndex > 5 && PageCount - PageIndex <= 5) {
                str = '<li class="cby-number-show" style=""><span data-value="1">1</span></li>';
                str += '<li class="cby-off-show"><span class="cby-off-click">......</span></li>';

                for (i = PageIndex - 3; i < PageCount; i++) {
                    str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                }
                if (PageIndex != PageCount) {
                    str += ["<li class=\"cby-number-show\"><span data-value=", PageCount, ">", PageCount, "</span></li>"].join("");
                } else {
                    str += ["<li class=\"cby-number-show\"><span class=\"active\" data-value=", PageCount, ">", PageCount, "</span></li>"].join("");
                }


            } else if (PageIndex <= 5 && PageCount - PageIndex > 5) {

                for (i = 1; i <= 5; i++) {
                    str += i == PageIndex ? '<li class="cby-number-show"><span class="active" data-value="' + i + '">' + i + '</span></li>' : '<li class="cby-number-show"><span data-value="' + i + '">' + i + '</span></li>'
                }

                str += '<li class="cby-off-show"><span class="cby-off-click">......</span></li>';

                for (i = PageCount - 4; i <= PageCount; i++) {
                    str += '<li class="cby-number-show"><span class="" data-value="' + i + '">' + i + '</span></li>';
                }

                // str += "<li class=\"cby-number-show\"><span data-value=", PageCount, ">", PageCount, "</span></li>";

            } else {
                return;
            }

            PageBody.html(str);

            $table_foot.find(".change-input").val(PageIndex);
        }
        var refreshPage = function (PageSize, PageIndex) {
        }

        if (Data && Data.length > 0) {
            refreshPage = refreshPage_Local_Init(Data, fn, refeshPageCount);
        } else if (parms && parms.$URI) {
            refreshPage = refreshPage_remote_Init(parms, fn, refeshPageCount);
        } else {
            return;
        }

        if ($Table.nextAll(".cby-paging-body")[0]) {
            $Table.nextAll(".cby-paging-body").remove();


        }
        $table_foot = $(pageTemplate);
        $Table.after($table_foot); 
        //上一页
        $table_foot.delegate(".cby-prv-page", "click", function () {
            var _TableFootData = GetTableFootData($table_foot);
            if (_TableFootData.PageIndex <= 1) {
                alert("已经是第一页了！");
            } else {
                refreshPage(_TableFootData.PageSize, Number(_TableFootData.PageIndex) - 1);
            }

        });
        //下一页
        $table_foot.delegate(".cby-next-page", "click", function () {
            var _TableFootData = GetTableFootData($table_foot);
            if (_TableFootData.PageIndex >= _TableFootData.PageCount) {
                alert("已经是最后一页了！");
            } else {
                refreshPage(_TableFootData.PageSize, Number(_TableFootData.PageIndex) + 1);
            }

        });

        //首页
        $table_foot.delegate(".cby-first-page", "click", function () {
            var _TableFootData = GetTableFootData($table_foot);
            if (_TableFootData.PageIndex > 1)
                refreshPage(_TableFootData.PageSize, 1);

        });
        //尾页
        $table_foot.delegate(".cby-last-page", "click", function () {
            var _TableFootData = GetTableFootData($table_foot);
            if (_TableFootData.PageIndex < _TableFootData.PageCount)
                refreshPage(_TableFootData.PageSize, 1);

        });
        //跳转指定页
        $table_foot.delegate(".change-input", "change", function () {
            var _TableFootData = GetTableFootData($table_foot);
            var val = $(this).val();
            if (_TableFootData.PageCount < val) {
                val = _TableFootData.PageCount;
                $(this).val(val);
                return;
            }
            if (val <= 0) {
                val = _TableFootData.PageIndex;
                $(this).val(val);
                return;
            }
            if (_TableFootData.PageIndex != val)
                refreshPage(_TableFootData.PageSize, val);
        });
        //更改每页条数
        $table_foot.delegate("#cby-select-onepage", "change", function () {
            var _PageSize = $(this).val();
            var _TableFootData = GetTableFootData($table_foot);
            $(this).attr("data-value", _PageSize);

            if (_PageSize == _TableFootData.PageSize)
                return;

            var _PageIndex = Math.floor(((_TableFootData.PageIndex - 1) * _TableFootData.PageSize) / _PageSize) + 1;
            //运算当前应该看哪页 PageIndex
            if (_PageIndex > _TableFootData.PageCount)
                _PageIndex = _TableFootData.PageCount;
            if (_PageIndex < 1)
                _PageIndex = 1;
            refreshPage(_PageSize, _PageIndex);

        });

        $table_foot.delegate(".nowpage-input", "change", function () {
            var _PageSize = $(this).val();
            if (_PageSize < mPageSizeMin)
                _PageSize = mPageSizeMin;
            if (_PageSize > mPageSizeMax)
                _PageSize = mPageSizeMax;
            $(this).val(_PageSize);
            var _TableFootData = GetTableFootData($table_foot);
            $(this).attr("data-value", _PageSize);

            if (_PageSize == _TableFootData.PageSize)
                return;

            var _PageIndex = Math.floor(((_TableFootData.PageIndex - 1) * _TableFootData.PageSize) / _PageSize) + 1;
            //运算当前应该看哪页 PageIndex
            if (_PageIndex > _TableFootData.PageCount)
                _PageIndex = _TableFootData.PageCount;
            if (_PageIndex < 1)
                _PageIndex = 1;
            refreshPage(_PageSize, _PageIndex);

        });

        // 数字点击事件
        $table_foot.delegate(".cby-page-number .cby-number-show", "click", function () {
            // $(this).addClass('active');
            var _PageIndex = $(this).children().attr("data-value");
            var _TableFootData = GetTableFootData($table_foot);
            if (_PageIndex > _TableFootData.PageCount)
                _PageIndex = _TableFootData.PageCount;
            if (_PageIndex < 1)
                _PageIndex = 1;

            if (_PageIndex == _TableFootData.PageIndex)
                return;
            refreshPage(_TableFootData.PageSize, _PageIndex);

        });



        refreshPage(mPageSize, 1);



    };



    //刷新分页页面
    var refreshPage = function () {

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
        var flag = $(".table-part").find(".cby-paging-body");
        if (flag) {
            $(".cby-paging-body").remove();
        }
        //将渲染的分页添加到原页面中
        $(".table-part").append(pageTemplate);
        //渲染分页
        var pagingInfo = $("#cby-page-number");
        pagingInfo.html("");
        // pagingInfo.append($('<li class="cby-off-show"><span class="cby-off-click">......</span></li>'));
        var li = $('<li class="cby-number-show" style="border-radius: 3px 0px 0px 3px;"><span data="1">&laquo;</span></li>')
        pagingInfo.append(li)
        if (PAGES <= 10) {
            for (var i = 1; i <= PAGES; i++) {
                var li = $('<li class="cby-number-show"><span data="' + i + '">' + i + '</span></li>');
                addActive(li, i, NOWPAGE)
                pagingInfo.append(li);
            }
            // 当前页是前10页
        } else if (NOWPAGE < 10) {
            for (var i = 1; i <= 10; i++) {
                var li = $('<li class="cby-number-show"><span data="' + i + '">' + i + '</span></li>')
                addActive(li, i, NOWPAGE)
                pagingInfo.append(li)
            }
            pagingInfo.append('<li class="cby-off-show"><span class="cby-off-click">......</span></li>')
            pagingInfo.append('<li class="cby-number-show"><span data=' + PAGES + '>' + PAGES + '</span></li>')
            // 当前页面是最后10页
        } else if (PAGES - NOWPAGE < 10) {
            if (PAGES - 10 > 1) {
                pagingInfo.append('<li class="cby-number-show"><span data="1">1</span></li>')
                pagingInfo.append('<li class="cby-off-show"><span class="cby-off-click" >......</span></li>')
            }
            for (var i = PAGES - 10; i <= PAGES; i++) {
                var li = $('<li class="cby-number-show"><span data="' + i + '">' + i + '</span></li>')
                addActive(li, i, NOWPAGE)
                pagingInfo.append(li)
                if (i == 1) {
                    pagingInfo.append('<li class="cby-off-show"><span class="cby-off-click">......</span></li>')
                }
            }
        }
        else {
            // 当前页面基于所有页面中间位置
            // 初始化页面基准坐标

            tmpPageIndex = NOWPAGE;
            // pagingInfo.append('<li class="cby-number-show"><span data="1">'+tmpPageIndex+'</span></li>')
            for (var i = tmpPageIndex; i <= Number(tmpPageIndex) + 5; i++) {
                var li = $('<li class="cby-number-show"><span data="' + i + '">' + i + '</span></li>')
                addActive(li, i, NOWPAGE)
                pagingInfo.append(li)
            }
            pagingInfo.append('<li class="cby-off-show"><span class="cby-off-click">......</span></li>')

            for (var i = Number(PAGES - 5); i <= Number(PAGES); i++) {
                var li = $('<li class="cby-number-show"><span data="' + i + '">' + i + '</span></li>')
                addActive(li, i, NOWPAGE)
                pagingInfo.append(li)
            }
        }
        var li = $('<li class="cby-number-show" style="border-radius: 0px 3px 3px 0px;"><span data="' + PAGES + '">&raquo;</span></li>')
        pagingInfo.append(li)
        $(".cby-pages").html("/" + PAGES + "页");
        $(".change-input").attr('value', TURNPAGE);

        if (typeof (pageSelect) == "undefined") {
            pageSelect = OnePageConut;
        }
        var dataSelect = [
            { Name: Number(pageSelect) },
            { Name: Number(pageSelect) + 5 },
            { Name: Number(pageSelect) + 10 }
        ];
        $("#cby-select-onepage").html(($com.util.template(dataSelect, '<option value="{{Name}}">{{Name}}</option>')))
        $("#cby-select-onepage").val(OnePageConut);
        // $(".cby-paging-body").html($com.util.template(showPage, pageTemplate));
        // $("#cby-tbody-taskTable").html($com.util.template(_dataTaskAll, HTML.TableTaskItemMode));

    };
    // 添加分页按钮焦点
    var addActive = function (li, i, NOWPAGE) {
        if (i == NOWPAGE) {
            li.addClass('active')
        }
    };


    // $(".cby-off-click").off("click");



    return {
        init: init
    }
}); 