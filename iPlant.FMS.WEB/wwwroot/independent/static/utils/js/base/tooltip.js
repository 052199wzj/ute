define(['../jquery-3.1.1', './base'], function($zace, $com) {

	//var MainWidth = 0;
	var margin = 8;
	var iconWidth_top_bottom = 5; //上下时箭头的宽
	var iconHeight_top_bottom = 5; //上下时箭头的高
	var iconWidth_left_right = 25; //左上下时箭头的宽
	var iconHeight_left_right = 8; //右上下时箭头的高
	var error = 1; //计算存在的误差
	var height = 0; //弹出框的高（初始值）
	var targetWidth = 0; //目标元素的宽
	var targetHeight = 0; //目标元素的高
// 	var max_width = 150; //最大宽度为150px；
// 	var fontsize = 13; //字体大小为13px；

	var HTML = {
		MAIN: [
			'<div class="tooltip-contain"  style="padding:5px;position: absolute;width:{{width}}px;height:auto; ',
			'left: {{left}}px;z-index: 9999;background-color:{{MAIN_color}};opacity:1;border-radius:5px;">',
			'<div class="tooltip-header" style="" >{{header}}</div>',
			'<div class="tooltip-middle" style="" >{{Items}}</div>',
			'<div class="tooltip-footer" style="" >{{footer}}</div>',
			'{{Icon}}',
			'</div>',
		].join(""),
		ITEM: [
			'<div class="tooltip-middle-item" style="overflow:hidden;line-height:20px;" >',
			'<div class="tooltip-middle-item-left" style="float:left;width:40%;height:auto; ',
			'text-align: right;padding: 2px;color:black;word-wrap: break-word;word-break: break-all;overflow: hidden;" >{{name}}</div>',
			'<div class="tooltip-middle-item-right" style="float:left;width:60%;height:auto;',
			'text-align: left;padding: 2px;color:black;word-wrap: break-word;word-break: break-all;overflow: hidden;" >{{value}}</div>',
			'</div>',
		].join(""),
		TITLE: [].join(""),
		FOOTER: [].join(""),
		ICON: {
			Top: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9998; width: 0;height: 0;border-left: 5px solid transparent;',
				'border-right: 5px solid transparent;border-top: 8px solid {{ICON_color}};opacity:1;"><div class="border"></div></div>',
			].join(""),
			Bottom: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-left: 5px solid transparent;',
				'border-right: 5px solid transparent;border-bottom: 8px solid {{ICON_color}};opacity:1;"><div class="border"></div></div>',
			].join(""),
			Left: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-top: 5px solid transparent;',
				'border-left: 8px solid {{ICON_color}} ;border-bottom: 5px solid transparent;opacity:1;"><div class="border"></div></div>',
			].join(""),
			Right: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-top: 5px solid transparent;',
				'border-right: 8px solid {{ICON_color}} ;border-bottom: 5px solid transparent;opacity:1;"><div class="border"></div></div>',
			].join(""),
			Left_Top: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9998; width: 0;height: 0;border-top: 10px solid {{ICON_color}};',
				'border-left: 16px solid transparent ;border-right: 16px solid transparent ;transform: rotateZ(-148deg);opacity:1;"><div class="border"></div></div>',
			].join(""),
			Left_Bottom: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-bottom: 10px solid {{ICON_color}};',
				'border-left: 16px solid transparent ;border-right: 16px solid transparent ;transform: rotateZ(148deg);opacity:1;"><div class="border"></div></div>',
			].join(""),
			Right_Top: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-top: 10px solid {{ICON_color}};',
				'border-right: 16px solid transparent ;border-left: 16px solid transparent;transform: rotateZ(148deg);opacity:1;"><div class="border"></div></div>',
			].join(""),
			Right_Bottom: [
				'<div class="tooltip-icon" style="position:absolute;left: {{Icon_left}}px;',
				'z-index: 9999; width: 0;height: 0;border-bottom: 10px solid {{ICON_color}};',
				'border-right: 16px solid transparent ;border-left: 16px solid transparent ;transform: rotateZ(-148deg);opacity:1;"><div class="border"></div></div>',
			].join(""),
		},
	};
	
	var parms = {
		target: "",
		object: {},
		orientation: 2,
		Choice_color: 4,
		title: "",
		fn: "",
		max_width:150,
		fontsize:13,
	};
	var tool_tip_show = function(parms) {
//         if (!parms.contain)
//         	return;
		var _data = {
				width: 0,
				left: 0,
				header: parms.title ? $com.util.template(title, HTML.TITLE) : "",
				footer: parms.fn ? HTML.FOOTER : "",
				Items: "",
				Icon: "",
				MAIN_color: "",
			},
			_items = [],
			Icon = {
				Icon_left: 0,
				ICON_color: "",
			};
		//var num = 0;
		for (var p in parms.object) {
			//num++;
			_items.push({
				name: p,
				value:  parms.object[p]
			});
		}
		var _names = [];
		var _values = [];
		for (var p in _items) {
			_names.push(_items[p].name);
			_values.push(_items[p].value);
		}
		if (_items.length == 0) {
			alert("当前数据为空，请给数据");
			return;
		} else {
			//name值中长度最大的
			var name_maxLength = 0;
			for (var i = 0; i < _names.length; i++) {
				if (i == 0) {
					name_maxLength = _names[0].length;
				}
				if (i >= 0) {
					if (_names[i].length > name_maxLength) {
						name_maxLength = _names[i].length;
					}
				}
			}
			//value值中长度最大的
			var value_maxLength = 0;
			for (var i = 0; i < _values.length; i++) {
				if (i == 0) {
					value_maxLength = _values[0].length;
				}
				if (i > 0) {
					if (_values[i].length > value_maxLength) {
						value_maxLength = _values[i].length;
					}
				}
			}
			var maxWidth = name_maxLength * parms.fontsize + value_maxLength * parms.fontsize * (3 / 2) + 2 * margin + margin;
			if (maxWidth > parms.max_width) {
				maxWidth = parms.max_width;
			}
			_data.width = maxWidth;
		}

		_data.Items = $com.util.template(_items, HTML.ITEM);
		//_data.width = MainWidth;

		//根据 需要弹出提示框的对象 以及方向获得此弹出框的left top
		var _left_top = get_left_top(parms.target,  parms.orientation, _data.width);
		_data.left = _left_top.left;
		Icon.Icon_left = _left_top.Icon_left;

		var _Choice_color = get_Choice_color( parms.Choice_color);
		_data.MAIN_color = _Choice_color.MAIN_color;
		Icon.ICON_color = _Choice_color.ICON_color;

		_data.Icon = $com.util.template(Icon, _left_top.template);

		$("body").append($com.util.template(_data, HTML.MAIN));


		var resultTop = parms.target.offset().top;
		var resultIconTop = 0;
		height = $("body .tooltip-contain").height();

		switch ( parms.orientation) {
			case 1:
				resultTop -= (height + targetHeight + margin);
				resultIconTop = height + margin + iconHeight_top_bottom / 2 - error;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 2:
				resultTop += targetHeight + margin + iconHeight_top_bottom + error;
				resultIconTop -= margin;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 3:
				resultTop -= (height - targetHeight) / 2;
				resultIconTop = height / 2;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 4:
				resultTop -= (height - targetHeight) / 2;
				resultIconTop = height / 2;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 5:
				resultTop -= (height + margin + iconHeight_top_bottom + targetHeight);
				resultIconTop = height + margin;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 6:
				resultTop += targetHeight + margin + iconHeight_top_bottom;
				resultIconTop -= iconHeight_left_right;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 7:
				resultTop -= (height + margin + iconHeight_top_bottom + targetHeight);
				resultIconTop += height + margin;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
			case 8:
				resultTop += targetHeight + margin + iconHeight_top_bottom;
				resultIconTop -= iconHeight_left_right;
				$("body .tooltip-contain").css("top", resultTop);
				$(".tooltip-icon").css("top", resultIconTop);
				break;
		}
		if ( parms.Choice_color != 3 &&  parms.Choice_color != 4 &&  parms.Choice_color != 5) {
			$(".tooltip-middle-item-left").css("color", "white");
			$(".tooltip-middle-item-right").css("color", "white");

		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 1) {

			$(".border").css("position", "absolute");
			$(".border").css("top", "-10px");
			$(".border").css("left", "-5px");
			$(".border").css("border-left", "5px solid transparent");
			$(".border").css("border-right", "5px solid transparent");
			$(".border").css("border-top", "8px solid Beige");
			$(".tooltip-icon").css("border-top", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 2) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "2px");
			$(".border").css("left", "-5px");
			$(".border").css("border-left", "5px solid transparent");
			$(".border").css("border-right", "5px solid transparent");
			$(".border").css("border-bottom", "8px solid Beige");
			$(".tooltip-icon").css("border-bottom", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 3) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "-5px");
			$(".border").css("left", "-10px");
			$(".border").css("border-left", "8px solid Beige");
			$(".border").css("border-top", "5px solid transparent");
			$(".border").css("border-bottom", "5px solid transparent");
			$(".tooltip-icon").css("border-left", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 4) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "-5px");
			$(".border").css("left", "2px");
			$(".border").css("border-right", "8px solid Beige");
			$(".border").css("border-top", "5px solid transparent");
			$(".border").css("border-bottom", "5px solid transparent");
			$(".tooltip-icon").css("border-right", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 5) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-10px");
			$(".border").css("left", "-16px");
			$(".border").css("padding", "2px");
			$(".border").css("box-sizing", "border-box");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-top", "10px solid Beige");
			$(".border").css("transform", "scale(0.85)");
			$(".tooltip-icon").css("border-top", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 6) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "0px");
			$(".border").css("left", "-16px");
			$(".border").css("padding", "0px 4px 0px 0px ");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-bottom", "10px solid Beige");
			$(".border").css("transform", "scale(0.85)");
			$(".tooltip-icon").css("border-bottom", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}

		if ( parms.Choice_color == 3 &&  parms.orientation == 7) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-9px");
			$(".border").css("left", "-20px");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-top", "10px solid Beige");
			$(".border").css("transform", "scale(0.98)");
			$(".tooltip-icon").css("border-top", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 3 &&  parms.orientation == 8) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-1px");
			$(".border").css("right", "-12px");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-bottom", "10px solid Beige");
			$(".border").css("transform", "scale(0.98)");
			$(".tooltip-icon").css("border-bottom", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}


		if ( parms.Choice_color == 4 &&  parms.orientation == 1) {

			$(".border").css("position", "absolute" );
			$(".border").css("top", "-10px");
			$(".border").css("left", "-5px");
			$(".border").css("border-left", "5px solid transparent");
			$(".border").css("border-right", "5px solid transparent");
			$(".border").css("border-top", "8px solid WhiteSmoke");
			$(".tooltip-icon").css("border-top", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 2) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "2px");
			$(".border").css("left", "-5px");
			$(".border").css("border-left", "5px solid transparent");
			$(".border").css("border-right", "5px solid transparent");
			$(".border").css("border-bottom", "8px solid WhiteSmoke");
			$(".tooltip-icon").css("border-bottom", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 3) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "-5px");
			$(".border").css("left", "-10px");
			$(".border").css("border-left", "8px solid WhiteSmoke");
			$(".border").css("border-top", "5px solid transparent");
			$(".border").css("border-bottom", "5px solid transparent");
			$(".tooltip-icon").css("border-left", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 4) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-5px");
			$(".border").css("left", "2px");
			$(".border").css("border-right", "8px solid WhiteSmoke");
			$(".border").css("border-top", "5px solid transparent");
			$(".border").css("border-bottom", "5px solid transparent");
			$(".tooltip-icon").css("border-right", "8px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 && parms.orientation == 5) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "-10px");
			$(".border").css("left", "-16px");
			$(".border").css("padding", "2px");
			$(".border").css("box-sizing", "border-box");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-top", "10px solid WhiteSmoke");
			$(".border").css("transform", "scale(0.90)");
			$(".tooltip-icon").css("border-top", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");

		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 6) {
			$(".border").css("position", "absolute" );
			$(".border").css("top", "0px");
			$(".border").css("left", "-16px");
			$(".border").css("padding", "0px 4px 0px 0px ");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-bottom", "10px solid WhiteSmoke");
			$(".border").css("transform", "scale(0.85)");
			$(".tooltip-icon").css("border-bottom", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 7) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-9px");
			$(".border").css("left", "-20px");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-top", "10px solid WhiteSmoke");
			$(".border").css("transform", "scale(0.98)");
			$(".tooltip-icon").css("border-top", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
		if ( parms.Choice_color == 4 &&  parms.orientation == 8) {
			$(".border").css("position", "absolute");
			$(".border").css("top", "-1px");
			$(".border").css("right", "-12px");
			$(".border").css("border-left", "16px solid transparent");
			$(".border").css("border-right", "16px solid transparent");
			$(".border").css("border-bottom", "10px solid WhiteSmoke");
			$(".border").css("transform", "scale(0.98)");
			$(".tooltip-icon").css("border-bottom", "10px solid Gainsboro");
			$(".tooltip-contain").css("border", "1px solid Gainsboro");
		}
	};
	var get_Choice_color = function(Choice_color) {
		var color = {
			MAIN_color: "",
			ICON_color: "",
		}
		switch (Choice_color) {
			case 1:
				color.MAIN_color = color.ICON_color = "black";

				break;
			case 2:
				color.MAIN_color = color.ICON_color = "gray";
				break;
			case 3:
				color.MAIN_color = color.ICON_color = "Beige";
				break;
			case 4:
				color.MAIN_color = color.ICON_color = "WhiteSmoke";
				break;

		}
		return color;
	};
	var get_left_top = function(target, orientation, width) {
		var result = {
			left: 0,
			Icon_left: 0,
			template: "",

		};
		result.left = target.offset().left;
		targetWidth = target.width();
		targetHeight = target.height();



		switch ( orientation) {
			case 1:
				result.left += (targetWidth - width) / 2;

				result.Icon_left = (width - iconHeight_top_bottom) / 2;
				result.template = HTML.ICON.Top;

				break;
			case 2:
				//下
				result.left += (targetWidth - width) / 2;
				result.Icon_left = (width - iconHeight_top_bottom) / 2;
				result.template = HTML.ICON.Bottom;
				break;
			case 3:
				//左
				result.left -= (width + margin + iconWidth_top_bottom);
				result.Icon_left = width;
				result.template = HTML.ICON.Left;
				break;
			case 4:
				//右
				result.left += (targetWidth + margin + iconWidth_top_bottom);
				result.Icon_left -= (iconWidth_top_bottom + error);
				result.template = HTML.ICON.Right;
				break;
			case 5:
				//左上
				result.left -= (width + margin + iconWidth_top_bottom);
				result.Icon_left = width - iconWidth_left_right;
				result.template = HTML.ICON.Left_Top;
				break;
			case 6:
				//左下
				result.left -= (width + margin + iconWidth_top_bottom);
				result.Icon_left = width - iconWidth_left_right;
				result.template = HTML.ICON.Left_Bottom;
				break;
			case 7:
				//右上
				result.left += (targetWidth + margin + iconWidth_top_bottom);
				result.Icon_left = 0;
				result.template = HTML.ICON.Right_Top;
				break;
			case 8:
				//右下
				result.left += (targetWidth + margin + iconWidth_top_bottom);
				result.Icon_left = 0;
				result.template = HTML.ICON.Right_Bottom;
				break;
		}

		return result;
	};



	var tool_tip_hide = function() {

		$("body .tooltip-contain").remove();
	};
	var tooltip = {
		show: tool_tip_show,
		clear: tool_tip_hide,
	};

	return tooltip;

});
