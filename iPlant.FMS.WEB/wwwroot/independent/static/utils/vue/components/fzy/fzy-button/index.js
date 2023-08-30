define(function() {
    // 通用样式
    var style = {
        margin: '0 auto',
        padding: '6px 12px',
        width: 'auto',
        minWidth: '70px',
        height: '34px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 'normal',
    };

    // 产生样式
    function createStyle(type) {
        type = type || 'default';
        var arr = [];
        switch (type) {
            case 'primary':
                arr = ['#0ea9f7', '#0ea9f7', '#ffffff'];
                break;
            case 'info':
                arr = ['#ffffff', '#0ea9f7', '#0ea9f7'];
                break;
            case 'default':
            default:
                arr = ['#ffffff', '#cccccc', '#333333'];
                break;
        }
        style.backgroundColor = arr[0];
        style.borderColor = arr[1];
        style.color = arr[2];
        return style;
    }

    return {
        name:'fzyButton',
        functional: true,
        render: function(createElement, context) {
            typeof context.data.on.click === 'function'
            || console.error('click is not function');

            var options = {
                style: createStyle(context.props.type),
                on: {click: context.data.on.click},
            };
            return createElement('button', options, context.slots().default);
        },
    };
});