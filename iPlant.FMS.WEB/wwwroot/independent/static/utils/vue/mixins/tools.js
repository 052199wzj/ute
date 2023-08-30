/**
 * 常用工具类方法
 *
 * methods:
 *  Http:
 *      this.Http(uriName,params,function(res){})
 *
 *  Array:
 *      ToolArrEmpty        清空数组
 *      ToolArrReplace      替换数组内容
 *      ToolArrRemoveItems  删除符合条件的数组
 *
 *  Object:
 *      ToolDeepClone       深拷贝
 * filters:
 *  Time:
 *      ToolTime            返回有效时间 无效时间转换为 -
 *
 */
define([
    '../../js/base/base',
], function($com){


    function getMonth(d){
        var month = d.getMonth();
        if( month === 12 ) month = 1;
        else month += 1;
        return month;
    }


    //最小有效时间
    var StartTime = new Date('2020-01-01 00:00:00');
    /**
     * 请求默认提示语
     * key: 请求类型
     * val: 提示文本
     */
    var HttpErrMsg = {
        Get: '获取失败，请检查网络',
        get: '获取失败，请检查网络',
        Post: '提交失败，请检查网络',
        post: '提交失败，请检查网络',
    };
    return {
        data: {
            /**
             *  请求列表
             *  $URI: string    请求地址 - 必填
             *  type: string   请求类型 - 必填
             *  errMsg:string   错误提示 - 可填 默认值为 HttpErrMsg[$TYPE]
             */
            UriList: {},
        },
        methods: {
            // Http
            /***
             * 请求方法
             * @param uriName   请求名称
             * @param data      数据
             * @param fn        回调函数
             * @param context   上下文
             */
            Http: function(uriName, data, fn, context){
                var that = this;
                var u = that.UriList[uriName];
                var d = { $URI: u.url, $TYPE: u.type };

                function err(){
                    $com.app.tip(u.errMsg || HttpErrMsg[u.type]);
                }

                $com.app.ajax($.extend(d, data), fn, err, context);
            },

            // Array
            /**
             * 清空数组
             * @params {Array} 需要清空的数组
             */
            ToolArrEmpty: function(){
                for( var i = 0; i < arguments.length; i++ ){
                    arguments[i].splice(0, arguments[i].length);
                }
            },
            /**
             * 替换数组内容
             * @param {Array} arr   原数组
             * @param {Array} list  新数组
             */
            ToolArrReplace: function(arr, list){
                arr.splice(0, arr.length);
                list.forEach(function(item){
                    arr.push(item);
                });
            },
            /**
             * 删除符合条件的数组
             * @param {Array} arr   需要处理的数组
             * @param {Object} obj   删除的条件 如果对象为空则全部删除
             */
            ToolArrRemoveItems: function(arr, obj){
                var removeArr = [];
                var is = true;
                for( var i = 0, len = arr.length; i < len; i++ ){
                    is = true;
                    for( var objKey in obj ){
                        if( obj[objKey] !== arr[i][objKey] ){
                            is = false;
                            break;
                        }
                    }
                    // 符合条件
                    is && removeArr.push(i);

                }
                // 反序删除 保持需要处理的数据下标不变
                removeArr.reverse().forEach(function(index){
                    arr.splice(index, 1);
                });
            },

            // Object
            /**
             * 深拷贝
             * @param target
             * @returns {{}}
             * @constructor
             */
            ToolDeepClone: function(target){
                var result;
                if( typeof target === 'object' ){
                    // 数组
                    if( Array.isArray(target) ){
                        result = [];
                        for( var i in target ){
                            result.push(this.ToolDeepClone(target[i]));
                        }
                    } else if( target === null ){
                        result = null;
                    } else if( target.constructor === RegExp ){
                        result = target;
                    } else{
                        // 普通对象
                        result = {};
                        for( var i in target ){
                            result[i] = this.ToolDeepClone(target[i]);
                        }
                    }
                } else{
                    result = target;
                }
                return result;
            },

            // Date
            /**
             * 格式化时间
             * @param {Date} time Date对象 默认值: 当前时间
             * @param {String} formatStr 时间格式 默认值: yyyy-mm-dd h:i:s
             * @returns {String}
             */
            ToolFormatTime: function( formatStr,time){
                formatStr = formatStr || 'yyyy-mm-dd h:i:s';
                time = time || new Date();

                time = time instanceof Date ? time : new Date(time);

                return formatStr.replace(/[a-z]+/g, function(res){
                    switch( res.toLowerCase() ){
                        case 'yyyy':
                            return time.getFullYear();
                        case 'yy':
                            return time.getFullYear().toString().substr(2, 2);
                        case 'mm':
                            return getMonth(time).toString().padStart(2, '0');
                        case 'm':
                            return getMonth(time);
                        case 'dd':
                            return time.getDate().toString().padStart(2, '0');
                        case 'd':
                            return time.getDate();
                        case 'h':
                            return time.getHours().toString().padStart(2, '0');
                        case 'i':
                            return time.getMinutes().toString().padStart(2, '0');
                        case 's':
                            return time.getSeconds().toString().padStart(2, '0');
                    }
                });
            },
            /**
             * 获取n天前的时间
             * @param time {Date}   当前时间
             * @param day {Number}  天数
             * @param format        格式化时间 默认为yyyy-mm-dd 传入 Date 则返回Date对象
             * @returns {Date|String}
             */
            ToolDaysAgo: function(time, day, format){

                time = new Date(
                    ( new Date(time) ).getTime() + day * -86400000,
                );
                if( format && format === Date ){
                    return time;
                } else if( format ){
                    return this.ToolFormatTime( format,time);
                } else{
                    return this.ToolFormatTime( 'yyyy-mm-dd',time);
                }
            },

            // Table
            /**
             *
             * @param idList {Array} ID列表
             * @param nameStr {[String]|String} 名称列表 String时需以 , 间隔
             * @param options {Array} 原下拉框数据
             * @param farKey {?String} 绑定父级对应的Key - 可选
             * @param farVal {?String|Number} 新生成项的far值 - 可选
             * @returns {[Object]} 新的下拉框选项列表
             */
            ToolNewSelectOptions: function(idList, nameStr, options, farKey, farVal){
                var newOptions = $com.util.Clone(options);

                if( idList.length===0 || nameStr.length===0 || nameStr==='' )
                    return newOptions


                var oldOptions=Array.isArray(nameStr)?nameStr:nameStr.split(',')

                for( let i = 0; i < oldOptions.length; i++ ){
                    oldOptions[i] = { Name: oldOptions[i], ID: idList[i] };
                    if( farKey && farVal ) oldOptions[i][farKey] = farVal;
                }
                oldOptions.forEach(function(item){
                    for( let i = 0; i < options.length; i++ ){
                        if( farKey ){
                            if( options[i].ID === item.ID && options[i][farKey] === item[farKey] )
                                return false;
                        } else{
                            if( options[i].ID === item.ID ){
                                return false;
                            }
                        }
                    }
                    newOptions.push(item)
                });
                return newOptions;
            },

        },
        filters: {
            // 返回有效时间 无效时间转换为 -
            ToolTime: function(e){
                if( !e ){
                    return '-';
                }
                var now = new Date(e);
                return now > StartTime ? e : '-';
            },
            // 百分比，无小数
            ToolPAH: function(e){
                return ( e * 100 ).toFixed(0) + '%';
            },
            // 百分比，两位小数
            ToolPAH2: function(e){
                return ( e * 100 ).toFixed(2) + '%';
            },
            // 拼接数组
            ToolJoinArr:function(e){
                return Array.isArray(e)?e.join(','):''
            }
        },
    };
});
