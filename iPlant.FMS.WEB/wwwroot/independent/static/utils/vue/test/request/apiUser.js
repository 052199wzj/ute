define([ './request' ], function($){
    return {

        login: (username, password) =>
            $.post('User/Login', { user_id: username, user_name: username, passWord: password }),

        userList: params => $.get('User/All', params),

    };
});