/**
 * 常用组件
 *
 * fzy-table    基础表格
 *
 */
define([
    '../components/fzy/fzy-search/index',
    '../components/fzy/fzy-popup-form/index',
    '../components/fzy/fzy-table/index',
    '../components/fzy/fzy-title/index',
    '../components/fzy/fzy-button/index',
], function() {
    var components = {};
    for (let argument of arguments) {
        if (!argument.name) break;
        components[argument.name] = argument;
    }
    return {components: components};
});