require([
        './static/utils/js/jquery-3.1.1',
        './static/utils/js/base/base',
        './static/utils/js/base/push',
        './static/utils/vue/components/fzy/fzy-popup-form/index',
    ],
    function ($zac, $com, Push, $fzyPopupForm) {

        var model,
            //结束时间
            EndTime,
            //已办开始查询时间
            StartTimeHasDo,
            StartTimeNotice,
            //模块菜单集合
            AllModelList,
            //代办消息
            WaitDoList,
            HasDoList,
            NoticeList,
            //消息集合
            AllCounts = {},

            HTML;

        //隐藏打开变量
        var mMenuState = true;
        var mNum = 0;

        window.Data_Menu = [];
        window.User_Info = {};
        window.UserParams = {};
        window.TriggerFunctions = {};


        HTML = {
            //消息容器
            CONTENT: ['<div data-id="{{ID}}" class="lmvt-content" data-src="{{Url}}" data-event="{{EventModule}}">',
                '<div class="lmvt-imgContian" style="position: relative;background-color:{{IconColor}}">',
                '<img class="lmvt-content-img" src="{{Icon}}" data-imgname="1">',
                '<span class="badge" id="ContentBadge{{ID}}" style="background-color:red;position:absolute;top:-5px;font-size: 2.3vw;left: 15vw;">{{MessageCount}}</span>',
                '</div>',
                '<div class="lmvt-content-menu_name">{{Name}}</div>',
                '</div>'].join(''),

            CONTENT_NewsItemWillDo: ['<div class="NewsItem" style="height:20.6vw;" data-value={{ID}} data-active={{Active}} data-MessageID={{MessageID}} data-ModuleID={{ModuleID}} data-StepID={{StepID}}>',
                '<div class="NewsItem-top" >',
                '<div class="NewsItem-top-left">',
                '<img class="newItenImg" src="{{imgRe}}" style="background-color:{{IconColor}}"/>{{Title}}<span style="color:darkgrey">{{NURead}}</span></div>',
                '<div class="NewsItem-top-right">{{NewsTime}}</div>',
                '</div>',
                '<div class="NewsItem-bottom">{{MessageText}}</div>',
                '<div class="willDoMessageText {{IsShow}}"></div>',
                '</div>'].join(''),

            //消息体
            CONTENT_NewsItem: ['<div class="NewsItem NewsItem{{ID}}" style="height:6.6vw;" data-value={{ID}} data-active={{Active}} data-MessageID={{MessageID}} data-ModuleID={{ModuleID}} data-StepID={{StepID}}>',
                '<div class="NewsItem-top" >',
                '<div class="NewsItem-top-left">',
                '<img class="newItenImg" src="{{imgRe}}" style="background-color:{{IconColor}}" />{{Title}}</div>',
                '<div class="NewsItem-top-right">{{NewsTime}}</div>',
                '</div>',
                '<div class="NewsItem-bottom">{{MessageText}}</div>',
                '</div>'].join(''),

            Menu_One: ['<div class="zace-first-menu" data-gid="{{ID}}"  data-gname="{{Name}}">',

                '<a href="javascript:;" data-src="{{Icon}}" data-color="{{IconColor}}" >',
                '<img src="{{Icon}}" data-color="{{IconColor}}" alt="" /><span>{{Name}}<span>',
                '</a>',
                '</div>'].join(''),

            Menu_One_Separator: ['<div class="zace-separator"></div>'].join(''),

            Menu_Two: ['<div class="zace-second-menu {{GroupClass}}"  data-id="{{ID}}" data-group="{{IsGroup}}" data-default="{{IsDefault}}" data-url="{{Url}}"  data-name="{{Name}}" >',
                '<a href="javascript:;" data-src="{{Icon}}" data-color="{{IconColor}}" >  ',
                ' <img src="{{Icon}}" data-color="{{IconColor}}" alt="" /><span>{{Name}}<span></a>',
                ' <div class="zace-second-group-menu" style="display: none;">{{ThridList}}</div>',
                '</div>'].join(''),

            Menu_Thrid: ['<div class="zace-thrid-menu"  data-id="{{ID}}" data-default="{{IsDefault}}"  data-name="{{Name}}" data-url="{{Url}}">',
                '<a href="javascript:;"  data-src="{{Icon}}" data-color="{{IconColor}}">  ',
                ' <img src="{{Icon}}"  data-color="{{IconColor}}" alt="" /><span>{{Name}}<span></a>',
                '</div>'].join(''),

            IfarmeHeader: [' <div class="zace-iframe-contain"  data-id="{{id}}"  >',
                '<img src="{{src}}"  data-color="{{color}}" style=" float:left" />',
                '<div class="iFrame-center" ><span>{{header}}</span></div>',
                '<div class="iFrame-right iFrame-right-refresh" ><span class="glyphicon glyphicon-refresh"></span></div>',
                '<div class="iFrame-right iFrame-right-close" ><span class="glyphicon glyphicon-remove"></span>',
                ' </div>',
                '</div>'].join(''),

            Iframe: ['   <div class="zace-right-content" data-id="{{id}}" >',
                ' <iframe src="{{href}}"  frameborder="0"></iframe>',
                '</div>'].join(''),
        };

        model = $com.Model.create({
            name: '中石油天津大港测井射孔枪产线管控系统',

            type: $com.Model.MAIN,

            configure: function () {
                this.run();

            },

            events: function () {
                //打开菜单
                $('body').delegate('.femi-openClose', 'click', function () {
                    var $this = $(this);
                    //打开或隐藏菜单
                    if (mMenuState) {
                        mMenuState = false;

                        $('.zace-middle-left').css('width', '0');
                        $('.zace-middle-left').hide();
                        $('.zace-middle-center').css('left', '3px');

                        // $this.html('<span class="glyphicon glyphicon-eye-open" /><span>打开菜单</span>');

                    } else {
                        //隐藏菜单
                        //width:20%;
                        mMenuState = true;
                        $('.zace-middle-left').css({
                            width: '198px',
                        });
                        $('.zace-middle-left').show();
                        $('.zace-middle-center').css({
                            left: '198px',
                        });

                        // $this.html('<span class="glyphicon glyphicon-eye-close" /><span>隐藏菜单</span>');
                    }
                });
                $('body').delegate('.toolbarContent .femi-allClose', 'click', function () {
                    $('.zace-out-right .zace-sub-header .zace-iframe-contain').remove();
                    $('.zace-out-right .zace-sub-center .zace-right-content').remove();
                });
                $('body').delegate('.toolbarContent .femi-allClose-bt', 'click', function () {
                    var $selected = $('.zace-out-right .zace-sub-header .zace-iframe-contain.femi-selected'),
                        data_id = $selected.attr('data-id');
                    $('.zace-out-right .zace-sub-header .zace-iframe-contain:not(.femi-selected)').remove();
                    $('.zace-out-right .zace-sub-center .zace-right-content:not([data-id=' + data_id + '])').remove();
                });
                $('body').delegate('.toolbarContent .femi-fontsize-set', 'click', function () {

                    $('body').append($com.modal.show({
                        fontsize: window.femi_size ? window.femi_size : 0,
                    }, {
                        fontsize: {
                            index: 0,
                            name: '字体大小',
                            type: 'ArrayOne',
                            control: undefined,
                        },
                    }, '字体设置', function (rst) {


                        if (!rst || $.isEmptyObject(rst))
                            return;

                        var _fontsize = Number(rst.fontsize);
                        $com.util.fontsizeChange(_fontsize);

                    }, {
                        fontsize: [{
                            name: '标准',
                            value: 0,
                        }, {
                            name: '中',
                            value: 2,
                        }, {
                            name: '大',
                            value: 4,
                        }],
                    }));
                });
                $('body').delegate('.toolbarContent .femi-reload-config', 'click', function () {
                    model.com.loadAll();
                });


                //菜单内容与右边导航栏匹配
                //$("body").delegate(".zace-left-center  .zace-second-menu", "click", function () {
                //    var $this = $(this),
                //        data_id = $this.attr("data-id"),
                //        href = $this.attr("data-url"),
                //        header = $this.attr("data-name"),
                //        src = $this.find('a img').attr("src"),
                //        data = { 'header': header, 'href': href, 'id': data_id, 'src': src };

                //    iframeHeaderSet(data);


                //});
                //菜单内容与右边导航栏匹配
                $('body').delegate('.zace-left-center  .zace-second-menu', 'click', function () {
                    var $this = $(this),
                        group = $this.attr('data-group'),
                        $SecondContain = $this.closest('.zace-left-center');
                    _active = $this.hasClass('femi-active');


                    $SecondContain.find('.zace-second-menu[data-group=1] a').removeClass('femi-active');
                    $SecondContain.find('.zace-second-menu[data-group=1]').removeClass('femi-active');
                    $SecondContain.find('.zace-second-menu[data-group=1] .zace-second-group-menu').hide();


                    if (!isNaN(group) && Number(group) == 1) {
                        if (_active) {
                            $this.children('.zace-second-group-menu').hide();
                            $this.children('a').removeClass('femi-active');
                            $this.removeClass('femi-active');
                            return;
                        }
                        $this.children('.zace-second-group-menu').show();
                        $this.children('a').addClass('femi-active');
                        $this.addClass('femi-active');
                        return;
                    }

                    var data_id = $this.attr('data-id'),
                        href = $this.attr('data-url'),
                        header = $this.attr('data-name'),

                        _default = Number($this.attr('data-default')),
                        src = $this.find('a').attr('data-src'),
                        color = $this.find('a').attr('data-color'),

                        data = {
                            'header': header,
                            'href': href,
                            'id': data_id,
                            'src': src,
                            'color': color,
                            '_default': _default,
                        };


                    if (data._default == 0) {

                        //调用用户接口获取用户加密信息 (data-id)（密钥界面输入） 在Module下需要添加字段
                        model.com.getUserSecret({
                            ModuleID: data.id,
                        }, function (res) {
                            var str = $com.uri.setUrlQuery(res.info);
                            if (data.href.indexOf('?') < 0) {
                                data.href = data.href + '?' + str;
                            } else {
                                data.href = model.com.insert_flg(data.href, str, data.href.indexOf('?') + 1);
                            }
                            iframeHeaderSet(data);
                        });
                    } else {
                        iframeHeaderSet(data);
                    }

                });

                $('body').delegate('.zace-left-center  .zace-thrid-menu', 'click', function () {
                    var $this = $(this),
                        data_id = $this.attr('data-id'),
                        href = $this.attr('data-url'),
                        header = $this.attr('data-name'),

                        _default = Number($this.attr('data-default')),

                        src = $this.find('a').attr('data-src'),
                        color = $this.find('a').attr('data-color'),

                        data = {
                            'header': header,
                            'href': href,
                            'id': data_id,
                            'src': src,
                            'color': color,
                            '_default': _default,
                        };


                    if (data._default == 0) {

                        //调用用户接口获取用户加密信息 (data-id)（密钥界面输入） 在Module下需要添加字段
                        model.com.getUserSecret({
                            ModuleID: data.id,
                        }, function (res) {
                            var str = $com.uri.setUrlQuery(res.info);
                            if (data.href.indexOf('?') < 0) {
                                data.href = data.href + '?' + str;
                            } else {
                                data.href = model.com.insert_flg(data.href, str, data.href.indexOf('?') + 1);
                            }
                            iframeHeaderSet(data);
                        });
                    } else {
                        iframeHeaderSet(data);
                    }
                    return false;

                });

                //导航栏点击事件
                $('body').delegate('.zace-sub-header .zace-iframe-contain', 'click', function () {
                    var $this = $(this),
                        data_id = $this.attr('data-id');

                    $('.zace-out-right .zace-sub-header .zace-iframe-contain').removeClass('femi-selected');
                    $('.zace-out-right .zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']')
                        .addClass('femi-selected');


                    $('.zace-out-right .zace-sub-center .zace-right-content').hide();
                    $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + data_id + ']').show();
                    headerLeftAuto();
                    $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + data_id + ']').find('iframe')
                        .resize();
                });

                //菜单栏的上部伸缩
                $('body').delegate('.zace-left-top .zace-first-menu', 'click', function () {
                    var $this = $(this),
                        $Next = $this.nextAll('.zace-first-menu'),
                        topNum = $('.zace-left-top .zace-first-menu').length;

                    topNum -= $Next.length;


                    model.com.renderMenu(Data_Menu, topNum);

                    return false;

                });

                ////菜单栏的下部伸缩
                $('body').delegate('.zace-left-bom .zace-first-menu', 'click', function () {
                    var $this = $(this),
                        $Prev = $this.prevAll('.zace-first-menu'),
                        topNum = $('.zace-left-top .zace-first-menu').length;


                    topNum += ($Prev.length + 1);
                    model.com.renderMenu(Data_Menu, topNum);

                    return false;

                });
                //配置 添加项
                $('body').delegate('.toolbarContent .lmvt-add-item', 'click', function () {
                    var DEFAULT_VALUE = {
                            Menu: 0,
                        },
                        KEYWORD_LIST = [
                            'Menu|菜单选项|ArrayOne',
                        ],
                        KEYWORD_LISTItem = {},
                        FORMATTRT_LevelItem = {},
                        TypeSource = {
                            Menu: [
                                {
                                    name: 'WEB端',
                                    value: 0,
                                },
                                {
                                    name: '客户端',
                                    value: 1,
                                },
                                {
                                    name: 'APP端',
                                    value: 2,
                                },
                            ],
                        };
                    $.each(KEYWORD_LIST, function (i, item) {
                        var detail = item.split('|');
                        KEYWORD_LISTItem[detail[0]] = {
                            index: i,
                            name: detail[1],
                            type: detail.length > 2 ? detail[2] : undefined,
                            control: detail.length > 3 ? detail[3] : undefined,
                        };
                        if (detail.length > 2) {
                            FORMATTRT_LevelItem[detail[0]] = $com.util.getFormatter(TypeSource, detail[0], detail[2]);
                        }
                    });
                    $('body').append($com.modal.show(DEFAULT_VALUE, KEYWORD_LISTItem, '菜单设置', function (rst) {
                        //调用插入函数
                        if (!rst || $.isEmptyObject(rst))
                            return;


                        switch (Number(rst.Menu)) {
                            case 0:
                                window.iframeHeaderSet({
                                    'header': 'Web菜单设置',
                                    'href': './basic_Set/WebMenu.html',
                                    'id': 'WebMenu',
                                    'src': './static/images/menu/factoryRoute/station.png',
                                });
                                break;
                            case 1:
                                window.iframeHeaderSet({
                                    'header': '客户菜单设置',
                                    'href': './basic_Set/ClientMenu.html',
                                    'id': 'ClientMenu',
                                    'src': './static/images/menu/factoryRoute/station.png',
                                });
                                break;
                            case 2:
                                window.iframeHeaderSet({
                                    'header': 'APP菜单设置',
                                    'href': './basic_Set/AppMenu.html',
                                    'id': 'AppMenu',
                                    'src': './static/images/menu/factoryRoute/station.png',
                                });
                                break;
                            default:
                                break;
                        }
                        //model.com.postCommandSave({
                        //    data: PositionTemp,
                        //}, function (res) {

                        //});

                    }, TypeSource));
                });
                //处理导航栏的去掉事件
                $('body')
                    .delegate('.zace-sub-header .zace-iframe-contain .iFrame-right.iFrame-right-close', 'click', function () {
                        var $this = $(this),
                            $paren = $this.closest('.zace-iframe-contain'),
                            data_id = $paren.attr('data-id'),
                            $show = undefined,
                            content = $paren.find('.iFrame-center span').text();
                        show_id = undefined;
                        if (!confirm('是否关闭' + content + '页面？')) {
                            return;
                        }


                        if ($paren.hasClass('femi-selected')) {


                            if ($paren.next('.zace-iframe-contain')[0]) {
                                $show = $paren.next('.zace-iframe-contain');
                                show_id = $show.attr('data-id');
                            } else if ($paren.prev('.zace-iframe-contain')[0]) {
                                $show = $paren.prev('.zace-iframe-contain');
                                show_id = $show.attr('data-id');
                            }

                            $('.zace-out-right .zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']')
                                .remove();
                            $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + data_id + ']').remove();

                        } else {
                            $('.zace-out-right .zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']')
                                .remove();
                            $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + data_id + ']').remove();
                        }

                        if ($show && show_id) {
                            $('.zace-out-right .zace-sub-header .zace-iframe-contain[data-id=' + show_id + ']')
                                .addClass('femi-selected');
                            $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + show_id + ']').show();
                            $show.show();
                        }

                        headerRefresh();
                        headerLeftAuto();
                        return false;
                    });

                // 导航条刷新事件
                $('body')
                    .delegate('.zace-sub-header .zace-iframe-contain .iFrame-right.iFrame-right-refresh', 'click', function () {
                        var $this = $(this),
                            $paren = $this.closest('.zace-iframe-contain'),
                            data_id = $paren.attr('data-id'),
                            $content = $('.zace-out-right .zace-sub-center .zace-right-content[data-id=' + data_id + ']');

                        if ($content.children('iframe')[0] && $content.children('iframe')[0].contentWindow) {
                            if ($content.children('iframe')[0].contentWindow.HomeRefrush) {
                                $content.children('iframe')[0].contentWindow.HomeRefrush();
                            } else {
                                $content.children('iframe')[0].contentWindow.location.reload(true);
                            }

                        }
                    });


                //注销
                $('body').delegate('.femi-log-out', 'click', function () {
                    if (!confirm('是否注销？')) {
                        return;
                    }
                    model.com.close({}, function () {
                        window.location.href = '../index.html';
                    });
                });

                // 修改密码
                $('body').delegate('.femi-repari-zace', 'click', function () {
                    function confirmPassWord(rule, value, callback) {
                        var newPassWord = rule.$data.formData.PassWord;
                        if (newPassWord === value) callback();
                        else callback('两次密码不一致');
                    }

                    var option = [
                        {label: '用户名', value: 'Id', disabled: true, default: User_Info.LoginName, span: 24},
                        {label: '原密码', value: 'OldPassWord', type: 'password', rules: ['required'], span: 24},
                        {label: '新密码', value: 'PassWord', type: 'password', rules: ['required'], span: 24},
                        {
                            label: '确认密码', value: 'confirmPassWord', type: 'password', span: 24,
                            rules: [
                                'required',
                                {validator: confirmPassWord, trigger: 'blur'},
                            ],
                        },
                    ];
                    $fzyPopupForm.OPEN({
                        title: '修改密码',
                        option: option,
                        confirm: function (data) {
                            delete data.confirmPassWord;

                            $com.app.loading('修改中...');
                            model.com.postRepair(data, function () {
                                $com.app.loaded();
                                alert('修改成功');
                            });
                        },
                        style: {
                            dialogWidth: '700px',
                            labelPosition: 'right',
                            labelWidth: '80px'
                        }
                    });
                });

                //帮助
                $('body').delegate('.femi-header-helper', 'click',
                    window.open.bind(null, './1/广州地铁18号线生产管理系统WEB客户端使用手册.pdf')
                );

                //进入消息中心
                $('body').delegate('.lmvt-bell', 'click', function () {
                    window.iframeHeaderSet({
                        'header': '消息中心',
                        'href': './basic_Set/MessageCenter.html',
                        'id': '1945',
                        'src': '/MESCore/upload/image/组消息.svg',
                    });
                });

                //刷新
                $('body')
                    .delegate('.femi-msg-dropdown-menu .femi-msg-footer .femi-msg-tab.femi-msg-tab-active', 'click', function () {
                        switch (Order) {
                            case 1:
                                var obj = {};
                                model.com.getAllUnDoList(obj, function (res) {
                                    // $("#MustDo1").text(AllCounts.WaitDoCounts);
                                    $('.femi-msg-body-content .femi-msg-unhandle')
                                        .html($com.util.template(res, HTML.CONTENT_NewsItemWillDo));
                                    FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                    $('.femi-bell-msg').text(FootNews);
                                });
                                break;
                            case 2:
                                var obj = {};
                                model.com.getAllHasDoList(obj, function (res) {
                                    // $("#MustDo1").text(AllCounts.WaitDoCounts);
                                    $('.femi-msg-body-content .femi-msg-handle')
                                        .html($com.util.template(res, HTML.CONTENT_NewsItemWillDo));
                                    FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                    $('.femi-bell-msg').text(FootNews);
                                });
                                break;
                            case 3:
                                var obj = {};
                                model.com.getAllNoticeList(obj, function (res) {
                                    // $("#News3").text(AllCounts.NoticeCounts);
                                    $('.femi-msg-body-notify .femi-msg-handle')
                                        .html($com.util.template(res, HTML.CONTENT_NewsItemWillDo));
                                    FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                    $('.femi-bell-msg').text(FootNews);
                                });
                                break;
                        }

                        return false;
                    });
                //全部已读
                $('body')
                    .delegate('.femi-msg-dropdown-menu .femi-msg-footer .femi-msg-tab.femi-msg-all-read', 'click', function () {
                        switch (Order) {
                            case 1:
                                model.com.postHasRead(WaitDoList, function (arr) {
                                    model.com.postMsgRead({
                                        MsgIDList: arr,
                                    }, function (res1) {
                                        var obj = {};
                                        model.com.getAllUnDoList(obj, function (res) {
                                            // $("#MustDo1").text(AllCounts.WaitDoCounts);
                                            $('.femi-msg-body-content .femi-msg-unhandle')
                                                .html($com.util.template(res, HTML.CONTENT_NewsItemWillDo));
                                            FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                            $('.femi-bell-msg').text(FootNews);
                                        });
                                    });
                                });
                                break;
                            case 2:
                                break;
                            case 3:
                                model.com.postHasRead(NoticeList, function (arr) {
                                    model.com.postMsgRead({
                                        MsgIDList: arr,
                                    }, function (res1) {
                                        var obj = {};
                                        model.com.getAllNoticeList(obj, function (res) {
                                            // $("#News3").text(AllCounts.NoticeCounts);
                                            $('.femi-msg-body-notify .femi-msg-handle')
                                                .html($com.util.template(res, HTML.CONTENT_NewsItemWillDo));
                                            FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                            $('.femi-bell-msg').text(FootNews);
                                        });
                                    });
                                });
                                break;
                        }

                        return false;
                    });
                //查看更多
                $('body')
                    .delegate('.femi-msg-dropdown-menu .femi-msg-footer .femi-msg-tab.femi-msg-more', 'click', function () {


                    });

                //单击跳转处理界面
                $('body')
                    .delegate('.femi-msg-dropdown-menu .femi-msg-body .femi-msg-tab-active .NewsItem', 'click', function () {
                        var $this = $(this),
                            ID = Number($this.attr('data-value')),

                            //是否是已读的消息
                            IsActive = Number($this.attr('data-active')),

                            MessageID = Number($this.attr('data-MessageID')),
                            //模块ID
                            ModuleID = Number($this.attr('data-ModuleID'));

                        //菜单相关

                        //实例任务ID
                        StepID = Number($this.attr('data-StepID'));
                        //消息时间
                        MessageTime = $this.find('.NewsItem-top .NewsItem-top-right').text();
                        var arr = [];
                        arr.push(ID);
                        if (IsActive == 1 || IsActive == 0) {
                            //变化消息
                            //model.com.randerRead(ID);
                            $this.find('.willDoMessageText').removeClass('willDoShow');
                            $this.find('.willDoMessageText').addClass('willDoNone');
                            model.com.postMsgRead({
                                MsgIDList: arr,
                            }, function (res1) {
                                model.com.skip(ModuleID, MessageID, MessageTime, StepID);
                                if (Order == 3) {
                                    var obj = {};
                                    model.com.getAllNoticeList(obj, function (res) {
                                        $('#News3').text(AllCounts.NoticeCounts);
                                        FootNews = AllCounts.NoticeCounts + AllCounts.WaitDoCounts;
                                        $('#FooterBadge-100').text(FootNews);
                                    });
                                }
                            });
                        } else {
                            model.com.skip(ModuleID, MessageID, MessageTime, StepID);
                        }

                    });


                //切换
                $('body')
                    .delegate('.femi-msg-dropdown-menu .femi-msg-header .femi-msg-tab:not(.femi-msg-tab-active)', 'click', function () {

                        // var $this = $(this),
                        // 	tag_value = Number($this.attr("data-value"));

                        // switch (tag_value) {
                        // 	case 1:
                        // 	case 3:
                        // 		$this.parent().children().removeClass("femi-msg-tab-active");
                        // 		$this.addClass("femi-msg-tab-active");
                        // 		$this.parent().next().find('.femi-msg-header>div').removeClass("femi-msg-tab-active");
                        // 		$this.parent().next().find('.femi-msg-header>div[data-value=' + tag_value + ']').addClass('femi-msg-tab-active');
                        // 		$this.parent().next().find(".femi-msg-footer .femi-msg-all-read").show();
                        // 		break;
                        // 	case 2:
                        // 		$this.parent().children().removeClass("femi-msg-tab-active");
                        // 		$this.addClass("femi-msg-tab-active");
                        // 		$this.parent().next().find('.femi-msg-header>div').removeClass("femi-msg-tab-active");
                        // 		$this.parent().next().find('.femi-msg-header>div[data-value=' + tag_value + ']').addClass('femi-msg-tab-active');
                        // 		$this.parent().next().find(".femi-msg-footer .femi-msg-all-read").hide();

                        // 		break;

                        // 	default:
                        // 		break;

                        // }
                        // return false;

                    });


                var $zace_out_right = $('.zace-out-right');


                window.iframeHeaderSet = function (data) {

                    if (!data || !data.href || data.href.trim().length <= 0) {
                        alert('暂未开放');
                        return;
                    }


                    var data_id = data.id;
                    window.UserParams[data_id] = data;

                    if (data.refresh == 1 || data.refresh == true) {
                        $zace_out_right.find('.zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']').remove();
                        $zace_out_right.find('.zace-sub-center .zace-right-content[data-id=' + data_id + ']')
                            .remove();
                    }

                    if (!$zace_out_right.find('.zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']')[0]) {
                        $zace_out_right.find('.zace-sub-header').append($com.util.template(data, HTML.IfarmeHeader));
                        $zace_out_right.find('.zace-sub-center').append($com.util.template(data, HTML.Iframe));


                        $zace_out_right.find('.zace-sub-header .zace-iframe-contain>img').each(function (i, item) {
                            var $img = $(item),
                                src = $img.attr('src'),
                                color = $img.attr('data-color');

                            if (src == null || src == '' || src.length < 5)
                                return true;
                            if (src.substring(src.length - 4).toLowerCase() != '.svg')
                                return true;


                            var $div = $('<div style="display: inline;"></div>');
                            $div.load(src, function (responseTxt, statusTxt, xhr) {
                                if (statusTxt == 'success') {
                                    $img.before($div);
                                    if (color && color.length >= 4) {
                                        $div.find('svg path').attr('fill', color);
                                    }
                                    $img.remove();
                                }
                            });

                        });


                    } else {
                        $zace_out_right.find('.zace-sub-header .zace-iframe-contain[data-id=' + data_id + '] .iFrame-center span')
                            .html(data.header);
                        if ($zace_out_right.find('.zace-sub-center .zace-right-content[data-id=' + data_id + '] iframe')
                            .attr('src') != data.href)
                            $zace_out_right.find('.zace-sub-center .zace-right-content[data-id=' + data_id + '] iframe')
                                .attr('src', data.href);
                    }
                    $zace_out_right.find('.zace-sub-header .zace-iframe-contain').removeClass('femi-selected');

                    $zace_out_right.find('.zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']')
                        .addClass('femi-selected');

                    $zace_out_right.find('.zace-sub-header .zace-iframe-contain[data-id=' + data_id + ']').show();


                    // var Lenght = $zace_out_right.find(".zace-sub-header .zace-iframe-contain:visible").length;
                    // var $ShowOne = $zace_out_right.find(".zace-sub-header .zace-iframe-contain:not(.femi-selected):visible")[0] ? $($zace_out_right.find(".zace-sub-header .zace-iframe-contain:not(.femi-selected):visible")[0]) : undefined;

                    // if ((Lenght * 156 + 33 + 10) > $zace_out_right.find(".zace-sub-header")[0].offsetWidth && $ShowOne) {
                    // 	$ShowOne.hide();
                    // }
                    headerRefresh();

                    //iframe 展示当前的链接
                    $zace_out_right.find('.zace-sub-center .zace-right-content').hide();
                    $zace_out_right.find('.zace-sub-center .zace-right-content[data-id=' + data_id + ']').show();


                    headerLeftAuto();
                };

                var headerRefresh = function () {

                    var Lenght = $zace_out_right.find('.zace-sub-header .zace-iframe-contain:visible').length;

                    if ((Lenght * 156 + 33 + 10) > $zace_out_right.find('.zace-sub-header')[0].offsetWidth) {
                        $zace_out_right.find('.zace-sub-header .zace-iframe-contain:not(.femi-selected):visible')
                            .each(function (i, item) {
                                var $ShowOne = $(item);
                                $ShowOne.hide();
                                Lenght = $zace_out_right.find('.zace-sub-header .zace-iframe-contain:visible').length;
                                if ((Lenght * 156 + 33 + 10) <= $zace_out_right.find('.zace-sub-header')[0].offsetWidth) {
                                    return false;
                                }
                            });
                    } else if (((Lenght + 1) * 156 + 33 + 10) <= $zace_out_right.find('.zace-sub-header')[0].offsetWidth) {
                        var $hiddencontain = $zace_out_right.find('.zace-sub-header .zace-iframe-contain:not(.femi-selected):hidden');
                        var _length = $hiddencontain.length;
                        for (var i = _length - 1; i >= 0; i--) {
                            var $ShowOne = $($hiddencontain[i]);
                            $ShowOne.show();
                            Lenght = $zace_out_right.find('.zace-sub-header .zace-iframe-contain:visible').length;
                            if (((Lenght + 1) * 156 + 33 + 10) > $zace_out_right.find('.zace-sub-header')[0].offsetWidth) {
                                break;
                            }

                        }
                    }
                };

                var headerLeftAuto = function () {

                    var data_id = $zace_out_right.find('.zace-sub-header .zace-iframe-contain.femi-selected')
                        .attr('data-id');
                    if (isNaN(data_id))
                        return;
                    data_id = Number(data_id);

                    var _Own = false;
                    var _first_id = 0;
                    var _IsThird = false;
                    $.each(Data_Menu, function (i, item) {

                        $.each(item.ModuleList, function (m_i, m_item) {
                            if (m_item.ID != data_id)
                                return true;
                            _Own = true;
                            _first_id = item.ID;

                            if (item.GroupID > 0) {
                                _first_id = item.GroupID;
                                _IsThird = true;
                            }
                        });
                    });

                    if (!_Own || _first_id <= 0)
                        return;

                    if (!$('.zace-first-menu[data-gid=' + _first_id + ']')[0]) {
                        return;
                    }

                    var $firstMenu = $('.zace-first-menu[data-gid=' + _first_id + ']');

                    if (_IsThird) {
                        if ($('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')[0]) {
                            if ($('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')
                                .hasClass('femi-selected')) {
                                return;
                            } else {
                                $('.zace-second-group-menu .zace-thrid-menu').removeClass('femi-selected');
                                $('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')
                                    .addClass('femi-selected');
                            }
                            return;
                        }
                    } else {
                        if ($('.zace-second-menu[data-id=' + data_id + ']')[0]) {

                            if ($('.zace-second-menu[data-id=' + data_id + ']').hasClass('femi-selected')) {
                                return;
                            } else {
                                $('.zace-second-menu').removeClass('femi-selected');
                                $('.zace-second-menu.zace-group-menu').removeClass('femi-active');
                                $('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')
                                    .closest('.zace-second-menu.zace-group-menu').addClass('femi-active');
                                $('.zace-second-menu[data-id=' + data_id + ']').addClass('femi-selected');
                            }
                            return;
                        }
                    }
                    var topNum = 0;

                    if ($('.zace-first-menu[data-gid=' + _first_id + ']').parent().hasClass('zace-left-top')) {
                        var $Next = $firstMenu.nextAll('.zace-first-menu');
                        topNum = $('.zace-left-top .zace-first-menu').length;
                        topNum -= $Next.length;

                    } else if ($('.zace-first-menu[data-gid=' + _first_id + ']').parent().hasClass('zace-left-bom')) {
                        var $Prev = $firstMenu.prevAll('.zace-first-menu');
                        topNum = $('.zace-left-top .zace-first-menu').length;
                        topNum += ($Prev.length + 1);
                    }
                    if (topNum <= 0) {
                        return;
                    }
                    model.com.renderMenu(Data_Menu, topNum);
                    if (_IsThird) {
                        $('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')
                            .closest('.zace-second-menu.zace-group-menu').addClass('femi-active');
                        $('.zace-second-group-menu .zace-thrid-menu[data-id=' + data_id + ']')
                            .addClass('femi-selected');
                    } else {
                        $('.zace-second-menu[data-id=' + data_id + ']').addClass('femi-selected');
                    }
                };

                window.HomeRefrush = function () {
                    model.com.get({
                        Type: 1,
                    }, function (res) {
                        if (res && res.info && res.info.module)
                            Data_Menu = res.info.module;
                        if (res && res.info && res.info.user)
                            window.User_Info = res.info.user;

                        window.parent._grad = res.info.user.Grad;
                        if (res.info.user.Grad < 1000) {
                            $('.lmvt-add-item').hide();
                        } else {
                            $('.lmvt-add-item').show();
                        }
                        $com.app.loaded();


                        model.com.renderMenu(Data_Menu, 1);

                        AllModelList = [];
                        $.each(Data_Menu, function (i, item) {
                            if (item.ModuleList && item.ModuleList.length > 0) {
                                AllModelList = AllModelList.concat(item.ModuleList);
                            }
                        });

                        model.com.RanderNews();
                        $('.zace-onload-company img').attr('src', window.User_Info.CompanyFaces);
                        $('.zace-onload-company a span').text(window.User_Info.CompanyName);
                        $('.zace-onload-user img').attr('src', window.User_Info.Faces);
                        $('.zace-onload-user  a span').text(window.User_Info.Name);

                        // window.iframeHeaderSet({
                        // 	'header': '全厂生产概况',
                        // 	'href': './basic_Set/KanbanCar_first.html',
                        // 	'id': '373',
                        // 	'src': '/MESCore/upload/2020/03/31/161452_8710f965-46f2-408d-9529-d494dd87982f.png'
                        // });

                    });
                };

                window.AssignUser = function (_contentWindow) {
                    $com.modal.show({username: '', password: ''}, {
                        username: {index: 0, name: '用户名'},
                        password: {index: 1, name: '密码', type: 'Password'},
                    }, '身份验证', function (res) {

                        $com.app.loginUser(res.username, res.password, function (res) {
                            if (_contentWindow.HomeRefrush)
                                _contentWindow.HomeRefrush();
                            else {
                                _contentWindow.location.reload(true);
                            }
                            $com.app.loaded();
                        });

                    }, {}, function (res) {
                        if (res.username) {
                            res.username = res.username.trim();
                        }
                        if (res.password) {
                            res.password = res.password.trim();
                        }
                        if (res.username.length >= 6 && res.password >= 6) {
                            return true;
                        }
                        return false;
                    });
                };

            },

            run: function () {

                //请求权限
                Push.Permission.request();

                var RanderBadge = function () {

                    //待办集合
                    model.com.getGetUnDoList({}, function (res) {

                        //通知集合
                        model.com.getGetNoticeList({
                            StartTime: $com.util.format('yyyy-MM-dd', new Date()),
                            EndTime: $com.util.format('yyyy-MM-dd hh:mm:ss', new Date()),
                        }, function (Noce) {
                            if (!res)
                                return;
                            //消息数
                            var counts = res.info;
                            //未发送消息集合
                            var UnSendArr = [],
                                UnDoAndNotice = [];

                            $.each(res.list, function (i, item) {
                                if (item.Active != 0)
                                    return true;
                            });

                            if (!Noce)
                                return;
                            counts = counts + Noce.info;

                            UnDoAndNotice = res.list.concat(Noce.list);

                            var UnSendList = UnDoAndNotice.filter(function (item) {
                                return item.Active == 0 && (item.SendStatus & parseInt('100', 2)) == 0;
                            });

                            UnSendArr = UnSendList.map(function (res) {
                                return res.ID;
                            });

                            // $.each(UnSendList, function (i, item) {
                            // 	item.Active = 1;
                            // });

                            $com.util.deleteLowerProperty(UnSendList);

                            if (counts == 0) {
                                $('.femi-bell-msg').hide();
                            } else {
                                $('.femi-bell-msg').show();
                            }


                            if (counts == 0) {
                                counts = '';
                            }

                            $('.femi-bell-msg').text(counts);
                            //一次性发送所有的消息
                            if (UnSendArr.length > 0)
                                var MsgIDList = [];
                            model.com.postMsgUpdate({
                                MsgIDList: UnSendArr,
                                SendStatus: parseInt('100', 2)
                            }, function (res) {
                                $.each(UnSendList, function (i, item) {
                                    if (item.SendStatus > 0) {
                                        model.com.SendMessage(item);
                                    }

                                });
                            });
                        });

                    });

                    setTimeout(RanderBadge, 60000);
                };
                RanderBadge();

                EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());

                StartTimeHasDo = StartTimeNotice = $com.util.format('yyyy-MM-dd', new Date());

                //获取所有的代办消息


                //window._grad=Number(model.query.Grad);


                var wLoad = 0;
                // $com.app.loading("正在加载配置！");

                // model.com.getUserAll({
                // 	active: 2
                // }, function (res) {
                // 	window._UserAll = res.list;
                // 	wLoad++;
                // });

                // model.com.getBusiness({}, function (res) {
                // 	window._Business = res.list;
                // 	wLoad++;
                // });
                // model.com.getFactory({}, function (res) {
                // 	window._Factory = res.list;
                // 	wLoad++;
                // });
                // model.com.getWorkShop({}, function (res) {
                // 	window._WorkShop = res.list;
                // 	wLoad++;

                // });
                // model.com.getLine({}, function (res) {
                // 	window._Line = res.list;
                // 	wLoad++;
                // });
                // model.com.getStation({}, function (res) {
                // 	window._Station = res.list;
                // 	wLoad++;
                // });
                // model.com.getDevice({}, function (res) {
                // 	window._Device = res.list;
                // 	wLoad++;
                // });
                // model.com.getSpare({}, function (res) {
                // 	window._Spare = res.list;
                // 	wLoad++;
                // });

                // var ShiftCurrent = function () {
                // 	model.com.getCurrentShift({}, function (res) {
                // 		window._CurrentShift = res.info;
                // 	});
                // 	// setTimeout(ShiftCurrent, 60000);
                // }
                // ShiftCurrent();

                var LoadConfig = function () {
                    if (wLoad >= 0) {
                        //$com.app.loaded();
                        //model.com.renderMenu(Data_Menu, 1);
                        model.com.get({
                            Type: 1,
                        }, function (res) {
                            if (res && res.info && res.info.module)
                                Data_Menu = res.info.module;
                            if (res && res.info && res.info.user)
                                window.User_Info = res.info.user;

                            window.parent._grad = res.info.user.Grad;
                            if (res.info.user.Grad < 1000) {
                                $('.lmvt-add-item').hide();
                            } else {
                                $('.lmvt-add-item').show();
                            }
                            $com.app.loaded();


                            model.com.renderMenu(Data_Menu, 1);

                            AllModelList = [];
                            $.each(Data_Menu, function (i, item) {
                                if (item.ModuleList && item.ModuleList.length > 0) {
                                    AllModelList = AllModelList.concat(item.ModuleList);
                                }
                            });

                            model.com.RanderNews();
                            $('.zace-onload-company img').attr('src', window.User_Info.CompanyFaces);
                            $('.zace-onload-company a span').text(window.User_Info.CompanyName);
                            $('.zace-onload-user img').attr('src', window.User_Info.Faces);
                            $('.zace-onload-user  a span').text(window.User_Info.Name);

                            // window.iframeHeaderSet({
                            // 	'header': '全厂生产概况',
                            // 	'href': './basic_Set/KanbanCar_first.html',
                            // 	'id': '373',
                            // 	'src': '/MESCore/upload/2020/03/31/161452_8710f965-46f2-408d-9529-d494dd87982f.png'
                            // });

                        });
                    } else {
                        setTimeout(LoadConfig, 100);
                    }

                    model.com.getUserAll({
                        active: -1,
                    }, function (res) {
                        window._UserAll = res.list;
                    });
                };
                LoadConfig();

            },

            com: {
                //消息推送
                SendMessage: function (data) {

                    //菜单对象
                    const MenuObj = window.Data_Menu.filter(function (item) {
                        return item.EventModule == data.ModuleID;
                    })[0];

                    // Push.create(data.Title, {
                    // 	// body 选项是通知的内容
                    // 	body: data.MessageText,
                    // 	// icon 选项是通知的图片
                    // 	icon: './icon.png',
                    // 	// timeout 选项是通知停留时间
                    // 	timeout: 40000,
                    // 	requireInteraction: true,


                    // 	onClick: function () {
                    // 		model.com.MessageOnClick(MenuObj, data);
                    // 	},
                    // });
                },
                //消息点击事件
                MessageOnClick: function (MenuObj, data) {
                    //菜单路径
                    var href = menuObj.Url,
                        //图标链接
                        scr = menuObj.Icon,
                        id = menuObj.ID,
                        //名称
                        header = menuObj.Name;

                    if (typeof (MenuObj) == 'undefined') {
                        alert('该消息请在手机APP上进行查看');
                    } else {
                        window.iframeHeaderSet({
                            'header': header,
                            'href': href,
                            'id': id,
                            'src': scr,
                        });
                    }
                },


                //最开始渲染消息
                RanderNews: function () {
                    //待办集合
                    model.com.getGetUnDoList({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        WaitDoList = res.list;
                        //NoticeList = res.info.NoticeList;
                        if (res.info == 0) {
                            res.info = '';
                        }
                        AllCounts.WaitDoCounts = res.info;
                        //AllCounts.NoticeCounts = res.info.NoticeCounts;
                        $.each(WaitDoList, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);

                            item.NewsTime = $com.util.format('MM-dd hh:mm', item.CreateTime);

                            var obj = model.com.getNewsSVG(1, item.ModuleID);
                            item.IconColor = obj.IconColor;
                            item.imgRe = obj.imgRe;
                            if (item.Active == 0 || item.Active == 1) {
                                item.IsShow = 'willDoShow';
                                item.NURead = '(未读)';
                            } else {
                                item.IsShow = 'willDoNone';
                                item.NURead = '';
                            }
                        });
                        $('.femi-msg-body-content .femi-msg-unhandle')
                            .html($com.util.template(WaitDoList, HTML.CONTENT_NewsItemWillDo));
                        $('#MustDo1').text(AllCounts.WaitDoCounts);
                        //已做集合
                        model.com.getGetHasDoList({StartTime: StartTimeHasDo, EndTime: EndTime}, function (Dores) {
                            if (!Dores)
                                return;
                            var list = Dores.list,
                                rst = [];
                            AllCounts.HasDoCounts = Dores.info;
                            HasDoList = Dores.list;
                            $.each(HasDoList, function (j, jtem) {
                                jtem.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', jtem.CreateTime);

                                jtem.NewsTime = $com.util.format('MM-dd hh:mm', jtem.CreateTime);

                                var obj = model.com.getNewsSVG(2, jtem.ModuleID);
                                jtem.IconColor = obj.IconColor;
                                jtem.imgRe = obj.imgRe;

                                //jtem.imgRe = "static/images/HasDoItem.png";
                            });
                            $('.femi-msg-body-content .femi-msg-handle')
                                .html($com.util.template(HasDoList, HTML.CONTENT_NewsItem));
                            $('#HasDo2').text(AllCounts.HasDoCounts);
                            //通知集合
                            model.com.getGetNoticeList({StartTime: StartTimeNotice, EndTime: EndTime}, function (Noce) {
                                if (!Noce)
                                    return;
                                var list = Noce.list,
                                    rst = [];
                                if (Noce.info == 0) {
                                    Noce.info = '';
                                }
                                AllCounts.NoticeCounts = Noce.info;
                                NoticeList = Noce.list;
                                $.each(NoticeList, function (k, ktem) {
                                    ktem.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', ktem.CreateTime);
                                    //ktem.imgRe = "static/images/NoticeItem.png";
                                    ktem.NewsTime = $com.util.format('MM-dd hh:mm', ktem.CreateTime);

                                    var obj = model.com.getNewsSVG(3, ktem.ModuleID);
                                    ktem.IconColor = obj.IconColor;
                                    ktem.imgRe = obj.imgRe;
                                    if (ktem.Active == 0 || ktem.Active == 1) {
                                        ktem.IsShow = 'willDoShow';
                                        ktem.NURead = '(未读)';
                                    } else {
                                        ktem.IsShow = 'willDoNone';
                                        ktem.NURead = '';
                                    }
                                });
                                $('.femi-msg-body-notify .femi-msg-handle')
                                    .html($com.util.template(NoticeList, HTML.CONTENT_NewsItemWillDo));
                                $('#News3').text(AllCounts.HasDoCounts);
                                $('.femi-bell-msg').text(AllCounts.NoticeCounts + AllCounts.WaitDoCounts);
                            });
                        });
                    });
                },
                //获取待办集合
                getAllUnDoList: function (obj, fn) {
                    if (!obj.StartTime) {
                        obj.StartTime = $com.util.format('yyyy-MM-dd', new Date());
                    }
                    if (!obj.EndTime) {
                        obj.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    }
                    model.com.getGetUnDoList({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        WaitDoList = res.list;
                        if (res.info == 0) {
                            res.info = '';
                        }
                        AllCounts.WaitDoCounts = res.info;
                        $.each(WaitDoList, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            //item.imgRe = "static/images/WillDo.png";
                            item.NewsTime = $com.util.format('MM-dd hh:mm', item.CreateTime);

                            var Colorobj = model.com.getNewsSVG(1, item.ModuleID);
                            item.IconColor = Colorobj.IconColor;
                            item.imgRe = Colorobj.imgRe;

                            if (item.Active == 0 || item.Active == 1) {
                                item.IsShow = 'willDoShow';
                                item.NURead = '(未读)';
                            } else {
                                item.IsShow = 'willDoNone';
                                item.NURead = '';
                            }
                        });
                        //$(".femi-msg-body-content .femi-msg-unhandle").html($com.util.template(WaitDoList, HTML.CONTENT_NewsItem));
                        $('#MustDo1').text(AllCounts.WaitDoCounts);
                        fn(WaitDoList);
                    });
                },
                //获取已办集合
                getAllHasDoList: function (obj, fn) {
                    if (!obj.StartTime) {
                        obj.StartTime = $com.util.format('yyyy-MM-dd', new Date());
                    }
                    if (!obj.EndTime) {
                        obj.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    }
                    //已做集合
                    model.com.getGetHasDoList({StartTime: obj.StartTime, EndTime: obj.EndTime}, function (Dores) {
                        if (!Dores)
                            return;
                        var list = Dores.list,
                            rst = [];
                        AllCounts.HasDoCounts = Dores.info;
                        HasDoList = Dores.list;
                        $.each(HasDoList, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            //item.imgRe = "static/images/HasDoItem.png";
                            item.NewsTime = $com.util.format('MM-dd hh:mm', item.CreateTime);

                            var Colorobj = model.com.getNewsSVG(2, item.ModuleID);
                            item.IconColor = Colorobj.IconColor;
                            item.imgRe = Colorobj.imgRe;

                        });
                        //$(".femi-msg-body-content .femi-msg-handle").html($com.util.template(HasDoList, HTML.CONTENT_NewsItem));
                        $('#HasDo2').text(AllCounts.HasDoCounts);
                        fn(HasDoList);
                    });
                },
                //获取通知集合
                getAllNoticeList: function (obj, fn) {
                    if (!obj.StartTime) {
                        obj.StartTime = $com.util.format('yyyy-MM-dd', new Date());
                    }
                    if (!obj.EndTime) {
                        obj.EndTime = $com.util.format('yyyy-MM-dd hh:mm:ss', new Date());
                    }
                    //通知集合
                    model.com.getGetNoticeList({StartTime: obj.StartTime, EndTime: obj.EndTime}, function (Dores) {
                        if (!Dores)
                            return;
                        var list = Dores.list,
                            rst = [];
                        if (Dores.info == 0) {
                            Dores.info = '';
                        }
                        AllCounts.NoticeCounts = Dores.info;
                        NoticeList = Dores.list;
                        $.each(NoticeList, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);
                            item.NewsTime = $com.util.format('MM-dd hh:mm', item.CreateTime);

                            //item.imgRe = "static/images/NoticeItem.png";
                            var Colorobj = model.com.getNewsSVG(3, item.ModuleID);
                            item.IconColor = Colorobj.IconColor;
                            item.imgRe = Colorobj.imgRe;

                            if (item.Active == 0 || item.Active == 1) {
                                item.IsShow = 'willDoShow';
                                item.NURead = '(未读)';
                            } else {
                                item.IsShow = 'willDoNone';
                                item.NURead = '';
                            }
                        });
                        //$(".femi-msg-body-notify .femi-msg-handle").html($com.util.template(NoticeList, HTML.CONTENT_NewsItem));
                        $('#News3').text(AllCounts.HasDoCounts);
                        fn(NoticeList);
                    });
                },
                RanderWillDONews: function () {
                    //代办(item)=>{return item.ModuleList.filter((jtem)=>{return jtem.ID===47))}}


                    model.com.getGetUnDoList({}, function (res) {
                        if (!res)
                            return;
                        var list = res.list,
                            rst = [];
                        WaitDoList = res.list;
                        //NoticeList = res.info.NoticeList;
                        if (res.info == 0) {
                            res.info = '';
                        }
                        AllCounts.WaitDoCounts = res.info;
                        //AllCounts.NoticeCounts = res.info.NoticeCounts;
                        $.each(WaitDoList, function (i, item) {
                            item.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', item.CreateTime);

                            item.NewsTime = $com.util.format('MM-dd hh:mm', item.CreateTime);

                            var obj = model.com.getNewsSVG(1, item.ModuleID);
                            item.IconColor = obj.IconColor;
                            item.imgRe = obj.imgRe;
                            if (item.Active == 0 || item.Active == 1) {
                                item.IsShow = 'willDoShow';
                                item.NURead = '(未读)';
                            } else {
                                item.IsShow = 'willDoNone';
                                item.NURead = '';
                            }
                        });
                        $('.femi-msg-body-content .femi-msg-unhandle')
                            .html($com.util.template(WaitDoList, HTML.CONTENT_NewsItem));
                    });
                },
                //已办消息
                RanderHasDoNews: function () {
                    model.com.getGetHasDoList({StartTime: StartTimeHasDo, EndTime: EndTime}, function (Dores) {
                        if (!Dores)
                            return;
                        var list = Dores.list,
                            rst = [];
                        AllCounts.HasDoCounts = Dores.info;
                        HasDoList = Dores.list;
                        $.each(HasDoList, function (j, jtem) {
                            jtem.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', jtem.CreateTime);

                            jtem.NewsTime = $com.util.format('MM-dd hh:mm', jtem.CreateTime);

                            var obj = model.com.getNewsSVG(2, jtem.ModuleID);
                            jtem.IconColor = obj.IconColor;
                            jtem.imgRe = obj.imgRe;

                            //jtem.imgRe = "static/images/HasDoItem.png";
                        });
                        $('.femi-msg-body-content .femi-msg-handle')
                            .html($com.util.template(HasDoList, HTML.CONTENT_NewsItem));
                    });
                },
                //通知集合
                RanderNoticeNews: function (fn) {
                    model.com.getGetNoticeList({StartTime: StartTimeNotice, EndTime: EndTime}, function (Noce) {
                        if (!Noce)
                            return;
                        var list = Noce.list,
                            rst = [];
                        if (Noce.info == 0) {
                            Noce.info = '';
                        }
                        AllCounts.NoticeCounts = Noce.info;
                        NoticeList = Noce.list;
                        $.each(NoticeList, function (k, ktem) {
                            ktem.CreateTime = $com.util.format('yyyy-MM-dd hh:mm:ss', ktem.CreateTime);
                            //ktem.imgRe = "static/images/NoticeItem.png";
                            ktem.NewsTime = $com.util.format('MM-dd hh:mm', ktem.CreateTime);

                            var obj = model.com.getNewsSVG(3, ktem.ModuleID);
                            ktem.IconColor = obj.IconColor;
                            ktem.imgRe = obj.imgRe;
                            if (ktem.Active == 0 || ktem.Active == 1) {
                                ktem.IsShow = 'willDoShow';
                                ktem.NURead = '(未读)';
                            } else {
                                ktem.IsShow = 'willDoNone';
                                ktem.NURead = '';
                            }
                        });
                        $('.femi-msg-body-content .femi-msg-handle')
                            .html($com.util.template(NoticeList, HTML.CONTENT_NewsItem));
                    });
                },
                //打开消息详情
                skip: function (ID, MessageID, MessageTime, StepID, menuObj) {

                    //菜单路径
                    var href = menuObj.Url,
                        //图标链接
                        scr = menuObj.Icon,
                        id = menuObj.id,
                        //名称
                        header = menuObj.Name;

                    //href 可以自己拼接后面的参数

                    switch (ID) {
                        case 1012:

                            window.iframeHeaderSet({
                                'header': header,
                                'href': href,
                                'id': id,
                                'src': scr,
                            });
                            break;
                    }
                },

                // 修改密码
                postRepair: function (data, fn, context) {
                    var d = {
                        $URI: '/User/PasswordModify',
                        $TYPE: 'post',
                    };

                    function err() {
                        $com.app.tip('修改失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //将消息变成已发送
                postMsgUpdate: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/MsgSent',
                        $TYPE: 'post',
                    };

                    function err() {
                        //$com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //将从未读变成已读
                postMsgRead: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/MsgRead',
                        $TYPE: 'post',
                    };

                    function err() {
                        //$com.app.tip('提交失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //通知
                getGetNoticeList: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/GetNoticeList',
                        $TYPE: 'get',
                    };

                    function err() {
                        //$com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //待办通知
                getGetUnDoList: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/GetUnDoList',
                        $TYPE: 'get',
                    };

                    function err() {
                        //$com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //已办
                getGetHasDoList: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/GetHasDoList',
                        $TYPE: 'get',
                    };

                    function err() {
                        //$com.app.tip('获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                //得到消息对应的颜色以及svg
                getNewsSVG: function (Order, ModuleID) {
                    var obj = {};
                    if (Order == 1) {
                        obj.imgRe = 'static/images/消息待办.svg';
                    } else if (Order == 2) {
                        obj.imgRe = 'static/images/消息已办.svg';
                    } else {
                        obj.imgRe = 'static/images/消息通知.svg';
                    }
                    obj.IconColor = '#249df7';

                    var menuObj = AllModelList.filter(function (item) {
                        return item.EventModule == ModuleID;
                    })[0];
                    if (menuObj)
                        obj.imgRe = menuObj.Icon;
                    // $.each(RanderInfoList.info.module, function (i, item) {
                    // 	$.each(item.ModuleList, function (j, jtem) {
                    // 		if (jtem.EventModule == ModuleID) {
                    // 			obj.imgRe = jtem.Icon;
                    // 			obj.IconColor = jtem.IconColor;
                    // 			//return false;
                    // 		}
                    // 	});
                    // });
                    return obj;
                },

                //将选择消息变成已读
                postHasRead: function (source, fn) {
                    var arr = [];
                    $.each(source, function (i, item) {
                        if (item.Active == 0 || item.Active == 1) {
                            arr.push(item.ID);
                        }
                    });
                    fn(arr);
                },
                get: function (data, fn, context) {
                    var d = {
                        $URI: '/HomePage/Show',
                        $TYPE: 'get',
                    };

                    function err() {
                        $com.app.tip('主页加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getUserAll: function (data, fn, context) {
                    var d = {
                        $URI: '/User/All',
                        $TYPE: 'get',
                    };

                    function err() {
                        console.log('人员加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getFactory: function (data, fn, context) {
                    var d = {
                        $URI: '/FMCFactory/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('工厂加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getBusiness: function (data, fn, context) {
                    var d = {
                        $URI: '/BusinessUnit/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('事业部加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getWorkShop: function (data, fn, context) {
                    var d = {
                        $URI: '/FMCWorkShop/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('车间加载失败，请检查网络');

                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getLine: function (data, fn, context) {
                    var d = {
                        $URI: '/FMCLine/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('产线加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getStation: function (data, fn, context) {
                    var d = {
                        $URI: '/FMCStation/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('工位加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getDevice: function (data, fn, context) {
                    var d = {
                        $URI: '/DeviceLedger/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('设备加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getSpare: function (data, fn, context) {
                    var d = {
                        $URI: '/SpareLedger/All',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('备件加载失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                //菜单配置
                getUserSecret: function (data, fn, context) {
                    var d = {
                        $URI: '/User/InfoSecret',
                        $TYPE: 'get',
                    };

                    function err() {
                        console.log('用户信息获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },
                getCurrentShift: function (data, fn, context) {
                    var d = {
                        $URI: '/SCHShift/CurrentShiftID',
                        $TYPE: 'get',

                    };

                    function err() {
                        console.log('服务连接失败，请检查网络');
                        //console.log('服务连接失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                getInfo: function (data, fn, context) {
                    var d = {
                        $URI: '/User/Info',
                        $TYPE: 'get',
                    };

                    function err() {
                        console.log('个人信息获取失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                load: function (data, fn, context) {
                    var d = {
                        $URI: '/MESConfig/Load',
                        $TYPE: 'post',
                    };

                    function err() {
                        console.log('重新载入配置失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);
                },

                close: function (data, fn, context) {
                    var d = {
                        $URI: '/User/Logout',
                        $TYPE: 'post',
                    };

                    function err() {
                        $com.app.tip('注销失败，请检查网络');
                    }

                    $com.app.ajax($.extend(d, data), fn, err, context);

                },

                renderMenu: function (data, top) {

                    if (!data || data.length < 1 || data.length < top)
                        return;

                    var _data = $com.util.Clone(data);
                    var _Onedata = [];
                    var _TwoGroup = [];
                    $.each(_data, function (i, item) {
                        if (!item.GroupID || item.GroupID <= 0) {
                            _Onedata.push(item);

                        } else {
                            _TwoGroup.push(item);
                        }
                    });


                    $.each(_Onedata, function (one_i, one_item) {
                        $.each(_TwoGroup, function (i, item) {

                            if (item.GroupID && item.GroupID > 0 && item.GroupID == one_item.ID) {
                                item.IsGroup = 1;
                                item.GroupClass = 'zace-group-menu';
                                item.Url = '';
                                item.Default = 0;
                                item.ThridList = $com.util.template(item.ModuleList, HTML.Menu_Thrid);

                                one_item.ModuleList.push(item);
                            }
                        });
                        one_item.ModuleList.sort(function (o1, o2) {
                            return o1.OrderNum - o2.OrderNum;
                        });
                    });


                    $('.zace-left-top').html($com.util.template(_Onedata.slice(0, top), HTML.Menu_One));

                    $('.zace-left-center').html($com.util.template(_Onedata[top - 1].ModuleList, HTML.Menu_Two));


                    $('.zace-left-bom  .zace-first-menu').remove();
                    $('.zace-left-bom')
                        .prepend($com.util.template(_Onedata.slice(top, _Onedata.length), HTML.Menu_One));


                    //$($('.zace-left-top .zace-first-menu')[0]).css("height","27px");

                    $('.zace-left-top').css('height', (top * 50) + 'px');

                    $('.zace-left-bom').css('height', ((_Onedata.length - top) * 50) + 'px');

                    $('.zace-left-center').css('top', (top * 50) + 60 + 'px')
                        .css('bottom', ((_Onedata.length - top) * 50) + 'px');


                    $('.zace-first-menu a img,.zace-second-menu a img').each(function (i, item) {
                        var $img = $(item),
                            src = $img.attr('src'),
                            color = $img.attr('data-color');

                        if (src == null || src == '' || src.length < 5)
                            return true;
                        if (src.substring(src.length - 4).toLowerCase() != '.svg')
                            return true;


                        var $div = $('<div style="display: inline;"></div>');
                        $div.load(src, function (responseTxt, statusTxt, xhr) {
                            if (statusTxt == 'success') {
                                $img.before($div);
                                if (color && color.length >= 4) {
                                    $div.find('svg path').attr('fill', color);
                                }
                                $img.remove();
                            }
                        });

                    });

                },

                loadAll: function () {
                    var wLoad = 0;
                    $com.app.loading('正在加载配置！');

                    model.com.getUserAll({
                        active: 2,
                    }, function (res) {
                        window._UserAll = res.list;
                        wLoad++;
                    });

                    model.com.getBusiness({}, function (res) {
                        window._Business = res.list;
                        wLoad++;
                    });
                    model.com.getFactory({}, function (res) {
                        window._Factory = res.list;
                        wLoad++;
                    });
                    model.com.getWorkShop({}, function (res) {
                        window._WorkShop = res.list;
                        wLoad++;

                    });
                    model.com.getLine({}, function (res) {
                        window._Line = res.list;
                        wLoad++;
                    });
                    model.com.getStation({}, function (res) {
                        window._Station = res.list;
                        wLoad++;
                    });
                    model.com.getDevice({}, function (res) {
                        window._Device = res.list;
                        wLoad++;
                    });
                    model.com.getSpare({}, function (res) {
                        window._Spare = res.list;
                        wLoad++;
                    });
                    var LoadConfig = function () {
                        if (wLoad >= 8) {

                            model.com.load({}, function (res) {

                                $com.app.loaded();
                                alert('重载配置成功!');

                            });
                        } else {
                            setTimeout(LoadConfig, 100);
                        }
                    };
                    LoadConfig();

                },
            },

            VueName: 'vm',
            el: '#fzy-component-box',

        });

        model.init();
    });
