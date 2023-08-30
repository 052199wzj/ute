define(function() {

    return {
        name: 'fzyTitle',
        functional: true,
        render(createElement, context) {
            var innerText = context.props.title || context.slots().default[0].text;
            var options = {
                domProps: {innerText},
                style: {
                    fontFamily: 'Times New Roman,微软雅黑',
                    fontSize: ' 20px',
                    color: 'black',
                },
                attrs: {type: 'primary', icon: 'el-icon-plus'},
            };
            return createElement('p', options);
        },

    };

});