define(['./jquery-3.1.1', './base/base'],
    function ($JQ, $com) {
        var farID,
            basicData;
        var HTML = {
            BackGroundNode: [
                '<div class="cby-charf-main">',
                '<div class="cby-charf-left"></div>',
                '<div class="cby-charf-right"></div>',
                '</div>'
            ].join(''),
            leftDetailNode: [
                '<div class="cby-charf-timeLine-item" data-status="{{Status}}"  data-statusName="{{StatusName}}"  data-index="{{Index}}">',
                '</div>'
            ].join(''),
            rightDetailNode: [
                '<div class="cby-charf-detail-item" data-status="{{Status}}" data-statusName="{{StatusName}}" data-historytaskid="{{HistoryTaskID}}">',
                '<div class="cby-charf-detail-item-top">',
                '<div class="cby-charf-detail-item-top-title" style=" width: 40%;text-align: center" >',
                '<span>{{NodeName}}</span>',
                '</div>',
                '<div class="cby-charf-detail-item-top-line" style=" width: 15%;">',
                '<span>——</span>',
                '</div>',
                '<div class="cby-charf-detail-item-top-status" style=" width: 15%;">',
                '<span style="color:{{ColorText}}">{{StatusName}}</span>',
                '</div>',
                '<div class="cby-charf-detail-item-top-time" style=" width: 25%;">',
                '<span>{{EndTime}}</span>',
                '</div>',
                '</div>',
                '<div class="cby-charf-detail-item-center">',
                '<span>{{Executor}}</span>',
                '</div>',
                '<div class="cby-charf-detail-item-bottom">',
                '<span>{{Command}}</span>',
                '</div>',
                '</div>',
            ].join(''),
        }
        // 参数说明：farString容器ID，如“#asd”;data显示原始数据，array类型；
        var getbasicData = function (farString, data) {
            basicData = data;
            farID = farString;
            $(farID).html('<div class="cby-charf-main"><div class="cby-charf-left"></div><div class="cby-charf-right"></div></div>');

            // 时间
            var _basicData = basicData;
            // var _basicData = basicData.sort(function (a, b) {
            //     return a.EndTime < b.EndTime ? 1 : -1
            // });
            $.each(_basicData, function (p, item_p) {
                item_p.Index = p + 1;
                if (item_p.StatusName == '驳回' || item_p.StatusName == '已关闭' || item_p.StatusName == '已撤销') {
                    item_p.ColorText = 'red';
                } else if (item_p.StatusName == '待执行') {
                    item_p.ColorText = 'gray';
                } else {
                    item_p.ColorText = 'green';
                }

            });

            $(".cby-charf-left").html($com.util.template(_basicData, HTML.leftDetailNode));
            $(".cby-charf-right").html($com.util.template(_basicData, HTML.rightDetailNode));
            $(".cby-charf-left .cby-charf-timeLine-item").each(function (i, item) {
                // if($(this).attr("data-status")==0){
                //     $(this).append('<embed class="cby-svg-circle" src="../static/utils/images/charf_detail/u978.svg"/>');
                // }
                if (($(this).attr("data-index") == _basicData.length)) {

                    $(this).append('<embed class="cby-svg-circle" src="../static/utils/images/charf_detail/u978.svg"/>');

                } else {
                    var wheight1 = $(".cby-charf-right .cby-charf-detail-item").eq(i).height();
                    var wheight2 = $(".cby-charf-right .cby-charf-detail-item").eq(i + 1).height();
                    switch ($(this).attr("data-statusName")) {

                        case '驳回':
                        case '已关闭':
                        case '已撤销':


                            $(this).append('<embed  class="cby-svg-circle" src="../static/utils/images/charf_detail/u980.svg"/><div class="zace-height" style="margin-left: 6px;margin-bottom: 6px;width:8px;background:red"  ><div/>');
                            var $div = $(this).find('.zace-height');
                            $div.css('height', (wheight1 + wheight2) / 2 + 'px');
                            // $div.css('margin-top', wheight1 / 2 - 7 + 'px');
                            break;
                        case '待执行':

                            $(this).append('<embed class="cby-svg-circle" src="../static/utils/images/charf_detail/u977.svg"/><div class="zace-height" style="margin-left: 6px;margin-bottom: 6px;width:8px;background:#AAAAAA" ><div/>');
                            var $div = $(this).find('.zace-height');
                            $div.css('height', (wheight1 + wheight2) / 2 + 'px');
                            // $div.css('margin-top', wheight1 / 2 - 7 + 'px');
                            break;
                        default:
                            $(this).append('<embed class="cby-svg-circle" src="../static/utils/images/charf_detail/u976.svg"/><div class="zace-height" style="margin-left: 6px;margin-bottom: 6px;width:8px;background:#97F20A"  ><div/>');
                            var $div = $(this).find('.zace-height');
                            $div.css('height', (wheight1 + wheight2) / 2 + 'px');
                            // $div.css('margin-top', wheight1 / 2 - 7 + 'px');
                            break;
                    }
                }
            });
        }

        return {
            getbasicData: getbasicData
        };

    });

