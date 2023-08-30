define([
    '../../js/base/base',
    ],function( $com){
    return {
        data: {
            /**
             *  请求列表
             *  $URI: string    请求地址 - 必填
             *  type: string   请求类型 - 必填
             *  errMsg:string   错误提示 - 可填 默认值为 httpErrMsg[$TYPE]
             */
            uriList:{
                // getDepartment: { type: 'Get', url: '/Department/AllDepartment' },
            },
            /**
             * 请求默认提示语
             * key: 请求类型
             * val: 提示文本
             */
            httpErrMsg: {
                Get: '获取失败，请检查网络',
                get: '获取失败，请检查网络',
                Post: '提交失败，请检查网络',
                post: '提交失败，请检查网络',
            },
        },
        methods: {
            /***
             * 公用请求方法
             * @param uriName   请求名称
             * @param data      数据
             * @param fn        回调函数
             * @param context   上下文
             */
            http(uriName, data, fn, context){
                var that = this;
                var u = that.uriList[uriName];
                var d = { $URI: u.url, $TYPE: u.type };
                function err(){
                    $com.app.tip(u.errMsg || that.httpErrMsg[u.type]);
                }
                $com.app.ajax($.extend(d, data), fn, err, context);
            },
        },
    }
});