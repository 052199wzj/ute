/*define([],function(){ 
*/	
(function(){
	var serviceCon = {
        url: '/api',
        loginUrl: '/api/HomePage/Index',
    };
	
	
	 
	
	
	var cookie ={
	
		set: function(name, val, days) {
			var times = new Date(),
				expires = ";expires=";
	
			if (days) {
				times.setTime(times.getTime() + (60000 * 60 * 24 * days));
				expires += times.toGMTString();
			} else {
				expires += "";
			}
	
			document.cookie = name + "=" + val + expires;
		},
	
		//delete cookie
		del: function(name) {
			document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
		},
	
		//get cookie
		get: function(name) {
			var arrCookie = document.cookie.split(";");
			for (var i = 0; i < arrCookie.length; i++) {
				var arr = arrCookie[i].replace(/(^\s+)|(\s+$)/g, "");
				arr = arr.split("=");
				if (arr[0] == name) {
					return arr.slice(1).join("=");
				}
			}
			return "";
		}
	}; 
	var math ={
		round : function(num, pow) {
			var BASE = Math.pow(10, pow || 4);
			return  Math.round(num * BASE) / BASE;
		}
	}
	var app = {

	        timeRule: function (time, now) {
	            var date = now || (new Date()).getTime(),
					dif = date - time,
					t = "";
	            console.log(dif);
	            if (dif < 60000) {
	                t = "1分钟前";
	            } else if (dif < 60000 * 60) {
	                t = Math.floor(dif / 60000) + "分钟前";
	            } else if (dif < 60000 * 60 * 24) {
	                t = Math.floor(dif / (60000 * 60)) + "小时前";
	            } else if (dif < 60000 * 60 * 24 * 2) {
	                t = "昨天";
	            } else {
	                t = util.format("MM-dd hh:mm", time);
	            }

	            return t;
	        },

	        percentColor: function (num) {
	            var color = "#000";
	            if (num < 33.3) {
	                color = "#ea0909";
	            } else if (num < 66.6) {
	                color = "#ea9809";
	            } else {
	                color = "#77ac19";
	            }

	            return "<em style='font-style:normal;color:" + color + "'>" + num + "%</em>";
	        },
 
	       

	        // code process
	        processCode: function (code, msg) {

	            var codeSet = {
	                9999: '服务器繁忙,请稍后再试',
	                9998: "您还没登录",
	                9997: "当前权限等级不够，无法操作",
	                1001: "请输入账号",
	                1002: "请输入密码",
	                1003: "当前权限等级不够，无法操作",
	                1004: "密码不合法",
	                1005: "账号或密码错误",
	                1006: "密码修改失败",
	                1007: "无效账号",
	                1008: "账号删除失败",
	                1009: "无法删除登录账号",
	                1010: "账号信息更新失败",
	                2001: "请输入账号",
	                2002: "请输入密码",
	                2003: "请选择管理权限",
	                2004: "账号添加失败",
	                2005: "该账号已经存在",
	                2006: "账号信息更新失败",
	                2007: "账号信息查询失败",
	                5001: "请输入服务名称",
	                5002: "请输入版本号",
	                5003: "服务删除失败",
	                6001: "请输入IP地址",
	                6002: "请输入密码",
	                6003: "Conserver删除失败",
	                7001: "请给架构起个可爱的名字",
	                7002: "请选择架构类型",
	                7003: "架构删除失败，请重试",
	                7004: "架构启用失败",
	                7005: "架构停用失败",
	                7006: "同时只能启用一个架构，如要启用该架构请先停止其他在用架构",
	                7007: "请先停止再进行删除操作",
	                8008: "请添加服务器",
	                8010: "监控出错",
	                9001: "组删除失败",
	                9995: "配置参数不合法",
	                9996: "添加失败",
	                4047: "该帐号已在别处登录，3秒后将自动退出"
	            };

	            switch (code) {
	                case 9998:
	                    app.removeInfo();
	                    window.location.href = serviceCon.loginUrl;
	                    break;
                    
	                default:
	                	app.tip(msg || codeSet[code] || code + '未知错误类型，请补充！');
	            }
	        },

	        tip: function (content, fn) {
	            alert(content);
	            fn && fn();
	        },

	        /**
	         * 高亮 就是字体变红色？？？
	         */
	        highlight: function (val, temp) {

	            temp = temp || '';
	            if (val !== '' && val != null && val != undefined) {
	                temp = temp.replace(new RegExp(val, 'g'), function () {
	                    return "<span style='color:red;'>" + val + "</span>";
	                });
	            }

	            return temp;
	        },

	        /**
	         * 得重写这个load等待函数 用动画
	         */
	        loading: function (content) { 
	        	
	            var _html = [
	                 '<div  class="femi-modal femi-loading"  >',
	                 	'<div></div>',
	         			'<p>{content}</p>',
	                 '</div>',
	                 '<div class="femi-modal-backdrop in femi-loading"  ></div>' 
					].join('');

	            if ($('.femi-loading').length > 0) {
	                $('.femi-loading').remove();
	            } else {
	                $('body').append(util.template({
	                    content: content || 'loading...'
	                }, _html));
	            }
	        },

	        ajax: function (data, fn, err, context) {
	            var suc, fail, __EMPTY = function () { }, _ajax, URI, TYPE;
	            if (arguments.length < 4) {
	                context = err;
	                err = __EMPTY;
	            }
	            if (util.isArray(fn)) {
	                suc = fn[0];
	                fail = fn[1] || __EMPTY;
	            } else {
	                suc = fn;
	                fail = __EMPTY;
	            }

	            URI = data.$URI || "";
	            TYPE = data.$TYPE || 'get';
	            delete data.$URI;
	            delete data.$TYPE;

	            _ajax = $.ajax({
	                url: serviceCon.url + URI,
	                type: TYPE,
	                data: TYPE.toLowerCase() === "get" ? data : util.stringify(data),
	                dataType: 'JSON',
	                timeout: global.timeout
	            });

	            _ajax.then(function (res) {
	                if (res.resultCode === 1000) {
	                    suc && suc.call(context || null, res.returnObject);
	                } else {
	                    app.processCode(res.resultCode, res.returnObject.msg || "");
	                    fail && fail.call(context || null, res.returnObject);
	                }
	            }, err);

	            return _ajax;
	        },

	        setImage: function (node, url) {
	            var limitWidth = 225,
					limitHeight = 150;
	            /* 2013-1-10 TD BUG 301 修改 */
	            function getImgSize(config) {
	                var lWidth = config.limitWidth || limitWidth,
						lHeight = config.limitHeight || limitHeight,
						rWidth = width = config.width,
						rHeight = height = config.height,
						scale;

	                // lh 150 lw 225 h503 w333
	                if ((height > width) || (height == width && lHeight > lWidth)) {
	                    scale = lHeight / height;
	                    if (scale < 1) {
	                        rHeight = lHeight;
	                        rWidth = scale * width;
	                    }
	                } else if ((height < width) || (height == width && lHeight <= lWidth)) {
	                    scale = lWidth / width;
	                    if (scale < 1) {
	                        rHeight = scale * height;
	                        rWidth = lWidth;
	                    }
	                }
	                return {
	                    width: rWidth,
	                    height: rHeight
	                };
	            }

	            (function (fileUrl) {
	                var notIe = $.browser.msie,
						size, imgWidth, imgHeight,
						imgs = new Image();
	                imgs.src = fileUrl + '?' + Math.random();
	                imgs.onload = imgs.onreadystatechange = function () {
	                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
	                        var img = document.createElement("img");
	                        $(img).attr("src", fileUrl);
	                        node.html(img);
	                        imgWidth = this.width;
	                        imgHeight = this.height;
	                        size = getImgSize({
	                            width: imgWidth,
	                            height: imgHeight
	                        });
	                        img.width = size.width;
	                        img.height = size.height;
	                    }
	                };
	            }(url));
	        },

	        removeInfo: function () {
	            cookie.del('__k_user_id_');
	            cookie.del('__k_company_id_');
	            cookie.del('__k_person_judge_');
	        },

	        /**
	         * 将滚动条移动到num处  只上移不下移 
	         */
	        scrollTop: function (num) {
	            var cTop = $(document).scrollTop();

	            if (cTop > num) {
	                $(document).scrollTop(num);
	            }
	        }, 
	    };
	var util =utilFunc();
	
	function utilFunc(){
		var AP = Array.prototype,
		OP = Object.prototype,
		APS = Array.prototype.slice;
	
		//空方法
		function _EMPTY() {}
		
		//反柯理化
		Function.prototype.uncurring = function() {
			var __this = this;
			return function() {
				return Function.prototype.call.apply(__this, arguments);
			};
		};
		
		function each(data, fn) {
		    var cb = fn || function () { };
		    if (data.length) {
		        for (var i = 0, len = data.length; i < len; i++) {
		            if (cb(data[i], i, data) === false) {
		                return false;
		            }
		        }
		    } else {
		        var i = 0;
		        for (var obj in data) {
		            var item = { Key: obj ,Value : data[obj]};
		            if (cb(item, i, data) === false) {
		                return false;
		            }
		            i++;
		        }
		    }
			
		}
		
		function assign(o1, o2) {
			for (var k in o2) {
				if (o2.hasOwnProperty(k)) {
					o1[k] = o2[k];
				}
			}
			return o1;
		}
		
		var typeStr = OP.toString.uncurring(),
			util = {};
		
		each("Array,Object,String,Function,Date,RegExp,Boolean,Number".split(","), function(type) {
			util['is' + type] = function(s) {
				return typeStr(s) === '[object ' + type + ']';
			};
		});
		
		// JSON
		function stringify(O) {
			if (window.JSON && JSON.stringify) return JSON.stringify(O);
			var S = [],
				J = "";
			if (util.isArray(O)) {
				for (var i = 0; i < O.length; i++)
					S.push(stringify(O[i]));
				J = '[' + S.join(',') + ']';
			} else if (util.isDate(O)) {
				J = "new Date(" + O.getTime() + ")";
			} else if (util.isRegexp(O) || util.isFunction(O)) {
				J = O.toString();
			} else if (util.isObject(O)) {
				for (var i in O) {
					O[i] = typeof(O[i]) == 'string' ? '"' + O[i] + '"' : (typeof(O[i]) === 'object' ? stringify(O[i]) : O[i]);
					S.push(i + ':' + O[i]);
				}
				J = '{' + S.join(',') + '}';
			}
		
			return J;
		}
		
		return assign(util, {
			isEmpty: function (value) {
				if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") {
					return true;
				} else {
					value = value.replace(/\s/g, "");
					if (value == "") {
						return true;
					}
					return false;
				}
			},
			boolean : function(str) {
				if (str === "true" || str === true) {
					return true;
				} else if (str === "false" || str === false) {
					return false;
				} else {
					return undefined;
				}
			},
		
			each: each,
		
			trim: function(s) {
				return s.replace(/(^\s*)|(\s*$)/g, '');
			},
		
			indexOf: function(ret, val) {
				for (var i = 0, len = ret.length; i < len; i++) {
					if (ret[i] == val) {
						return i;
					}
				}
				return -1;
			},
		
			//模版生成
			template: function(d, h) {
		
				var str = '';
		
				if (!util.isArray(d)) {
					d = [d];
				}
		
				if (!h) {
					throw new Error('cann\'t find template string!');
				}
		
				each(d, function(l, i) {
		
					str += h.replace(/\{\{\s*([a-zA-Z0-9\_\.\-\|\s]+)\s*\}\}/igm, function($1, $2) {
						var ret, value, tv;
						
						if ($2.indexOf('||') > -1) {
							ret = $2.split('||');
						} else {
							ret = [$2];
						}
		
						// 命令检测
						// 根据优先级执行相应命令
						// 检测最终数据
		
						for (var i = 0, len = ret.length; i < len; i++) {
							tv = l[util.trim(ret[i])];
							if (tv !== '' && tv != undefined && tv != null) {
								return tv;
							}
						}
						return '';
					});
				});
		
				return str;
			},
		
			//JSON to string
			stringify: stringify,
		
			parse: function(str) {
				try {
					if (str === "") {
						return [];
					}
					if (window.JSON && JSON.parse) {
						return JSON.parse(str);
					} else {
						return eval("(" + str + ")");
					}
				} catch (e) {
					throw new Error('not valid string');
				}
			},
		
			format: function(format, time) {
				var o, now;
		
				now = new Date(time || 0);
		
				o = {
					"M+": now.getMonth() + 1, //month
					"d+": now.getDate(), //day
					"h+": now.getHours(), //hour
					"m+": now.getMinutes(), //minute
					"s+": now.getSeconds(), //second
					"q+": Math.floor((now.getMonth() + 3) / 3), //quarter
					"S": now.getMilliseconds() //millisecond
				};
		
				if (now < new Date(2000,1,1))
				    o["h+"] -= 8;
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
		
				for (var k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				return format;
			},
		
			/*
			 * 获取命名空间
			 * @method getNamespace 获取命名空间对象
			 * @param {object} ns 命名空间起点对象
			 * @param {string} sns 空间字符串
			 * @returns 返回命名空间内容
			 */
			getNamespace: function(ns, sns) {
				var root = ns,
					ret = util.isArray(sns) ? sns : sns.split('.');
		
				try {
					//获取服务类型
					for (var i = 0, len = ret.length; i < len; i++) {
						root = root[ret[i]];
					}
				} catch (e) {
					root = ns;
				}
		
				return root;
			},
		
			reverse : function(obj) {
				var _obj = {};
				for (var p in obj) {
					if (obj.hasOwnProperty(p)) {
						_obj[obj[p]] = p;
					}
				}
		
				return _obj;
			}
		});
	}
	
	var uri={
			/*
			 * 获取URL查询参数，组装成对象返回
			 * @method getUrlQuery 获取查询参数
			 * @returns {object} 返回组装后对象
			 */
			getUrlQuery: function(str) {
		
				var search = str || window.location.search;
		
				if (search === '') return {};
		
				var str = search.charAt(0) === '?' ? search.substring(1) : search,
					temp = str.split('&'),
					ret = {};
		
				//生成对象
				for (var i = 0, len = temp.length; i < len; i++) {
		
					var arg = temp[i].split('=');
					var key = arg[0];
					var value = arg.slice(1).join("=");
					ret[key] = decodeURIComponent(value);
				}
		
				return ret;
			},
		
			/*
			 * 组装url地址
			 * @method setUrlQuery 获取查询参数
			 * @param {object} o 需要转化的对象
			 * @returns {string} 返回组装后对象
			 */
			setUrlQuery: function(o) {
				var str = '';
		
				if (Object.prototype.toString(o) !== "[object Object]") {
					return '';
				}
		
				for (var x in o) {
					if (o.hasOwnProperty(x)) {
						str = str + x + '=' + String(o[x] == null || o[x] == undefined ? '' : o[x]) + '&';
					}
				}
		
				str = str.substring(0, str.length - 1);
		
				return encodeURI(str);
			}
		};
})();
    
/*	return {
		cookie:cookie,
		math:math,
		util:util,
		uri: uri,
	};
});*/