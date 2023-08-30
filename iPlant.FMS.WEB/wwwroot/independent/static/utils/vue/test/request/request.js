define([
        '../../../js/base/axios.min',
    ],
    function(Axios){
        var service = Axios.create({
            baseURL: 'http://192.168.1.251:8181/iPlantSCADA/api/',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        });

        // 请求拦截器
        service.interceptors.request.use(
            function(config){
                return config;
            },
            function(error){
                return Promise.reject(error);
            },
        );
        // 响应拦截器
        service.interceptors.response.use(
            function(response){
                if( response.data.resultCode !== 1000 ){
                    alert(response.data.returnObject.msg);
                }
                return response.data;
            },
            function(error){
                if( error.message.indexOf('timeout') !== -1 ){
                    alert('网络超时');
                } else if( error.message === 'Network Error' ){
                    alert('网络连接错误');
                } else{
                    if( error.response.data )
                        alert(error.response.statusText);
                    else
                        alert('接口路径找不到');
                }
                return Promise.reject(error);
            },
        );

        return service;
    });