
define([
    '../../../../js/base/vue-element',
    '../../../../js/base/base',
], function(Vue, $com) {
    var template = `        
        <el-form 
            :model="formData" 
            size="medium" 
            inline
        >
            <el-form-item 
               v-for="item in formOptions"
                :key="item.value"
                :label="item.label"
            >
                <!--普通输入框-->
                <template v-if="item.type==='input'">
                    <el-input 
                        v-model="formData[item.value]" 
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        style="width:100%;"
                    ></el-input>
                </template>
                
                <!--数字输入框-->
                <template v-if="item.type==='number'">
                    <el-input 
                        v-model="formData[item.value]" 
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        type="number"
                        style="width:100%;"
                    ></el-input>
                </template>
                
                <!--密码框-->
                <template v-if="item.type==='password'">
                    <el-input 
                        v-model="formData[item.value]" 
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        type="password"
                        style="width:100%;"
                    ></el-input>
                </template>
                
                <!--多行文本框-->
                <template v-if="item.type==='textarea'">
                    <el-input 
                        v-model="formData[item.value]" 
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        type="textarea"
                        rows="3"
                        style="width:100%;"
                    ></el-input>
                </template>
                
                <!--下拉框-->
                <template v-else-if="item.type==='select'">
                    <el-select 
                        v-model="formData[item.value]" 
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        :clearable="item.clearable"
                        collapse-tags
                        filterable
                        :multiple="item.multiple"
                        style="width:100%;"
                        @change="fatherChange(item)"
                    >
                        <el-option 
                            v-for="option in item.newOptions || item.options""
                            :label="option.label" 
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </template>
                
                <!--日期选择器-->
                <template v-if="item.type==='date'">
                    <el-date-picker
                        v-model="formData[item.value]"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        type="date"
                        style="width:100%;"
                    ></el-date-picker>
                </template>
                
                <!--时间选择器-->
                <template v-if="item.type==='time'">
                    <el-time-picker
                        v-model="formData[item.value]"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        style="width:100%;"
                    ></el-time-picker>
                </template>
                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="empty">重置</el-button>
            </el-form-item>
        </el-form>
    `;

    var component = {
        name: 'fzySearch',
        components: {},
        template: template,
        props: {options: {required: true}},
        data: function() {
            return {
                formData: {}, // 表单数据
                formOptions: [], // 表单项
            };
        },
        created: function() {
            this.init();
        },
        methods: {
            init: function() {
                var that = this;
                var options = this.options;
                // 生成数据
                var formData = {};     // form data
                options.forEach(function(item) {

                    // 赋予属性
                    that.newDefaultOptions(item, options);

                    // 生成data
                    formData[item.value] = item.default;

                    // 生成子级下拉框options
                    if (item.child) {
                        item.child.forEach(function(child) {
                            options.forEach(function(op) {
                                if (op.value === child) {
                                    op.newOptions = [];
                                }
                            });
                        });
                    }

                });
                that.formData = formData; // 输入框数据
                that.formOptions = options;
                // 二次处理数据
                options.forEach(function(item) {
                    // 父级存在默认值时生成子集的可选项
                    if (item.type === 'select' && item.child && item.default) {
                        that.fatherChange(item);
                    }
                });
            },

            search: function() {
                this.$emit('search', this.formData);
            },
            empty: function() {
                this.init()
                this.$emit('empty', this.formData);
            },

            // 赋予默认属性
            newDefaultOptions: function(option, options) {
                // 默认为input
                option.type = option.type || 'input';
                // 默认提示语,特殊情况后续覆盖
                option.placeholder = '请选择' + option.label;

                switch (option.type) {
                    case 'input':
                        option.placeholder = '请输入' + option.label;
                        break;
                    case 'select':
                        // 多选
                        if (option.multiple) {
                            option.default = option.default || [];
                            if (!Array.isArray(option.default)) {
                                console.error('default is not Array');
                                return false;
                            }

                        }
                        // 存在子级
                        if (option.child) {
                            // 字符串处理为数组
                            if (typeof option.child === 'string') {
                                option.child = [option.child];
                            }
                            // 检测子级是否存在
                            option.child.forEach(function(item) {
                                var isErr = options.filter(function(opt) {
                                    return opt.value === item;
                                }).length === 0;
                                if (isErr) {
                                    console.warn('Can\'t find the child : ' + item);
                                    console.warn(option);
                                }
                            });
                        }
                        break;
                    case 'date':
                    case 'time':
                        option.default = option.default
                                         ? new Date(option.default)
                                         : '';
                        if (option.default.toString() === 'Invalid Date') {
                            console.warn(`The default value of ${option.value} is not a Date`);
                            console.warn(option);
                        }
                        break;
                    default:
                        break;
                }
            },
            // select   父级下拉框变化
            fatherChange(e) {
                if (!e.child) return false;

                var that = this;
                var value = this.formData[e.value];
                var childs = e.child;

                childs.forEach(function(child) {

                    // 清空子级的值
                    that.formData[child] = undefined;

                    that.formOptions.forEach(function(op) {

                        if (Array.isArray(value)) {
                            // 不符合条件,跳过本次循环
                            if (childs.indexOf(op.value) === -1) return false;
                            // 更新子级options
                            op.newOptions = op.options.filter(function(item) {
                                return value.indexOf(item.far) !== -1;
                            });
                            // 更新孙级
                            that.fatherChange(op);
                        } else {
                            if (op.value !== child) return false;

                            op.newOptions = op.options.filter(function(item) {
                                return item.far === value;
                            });

                            that.fatherChange(op);


                        }
                    });

                });


            },
        },
        /**
         * TODO 暂未改造
         * 等同于methods.init()
         * @param options
         * @constructor
         *     无Vue环境下可用
         *     可选参数: 传入后调用方式等同于this.$refs调用
         *         vue             实例
         *         componentName   组件ref名称
         */
        INIT(options) {
            if (options.vue && options.componentName) {
                options.vue.$refs[options.componentName].open(options);
            } else {
                var div = document.createElement('div');
                div.id = 'fzy-component-popup-form';
                div.innerHTML = `
                    <fzy-popup-form ref="fzyPopupForm"></fzy-popup-form>
                `;

                var popupForm = document.getElementById('fzy-component-popup-form');
                popupForm && document.body.removeChild(popupForm);
                document.body.appendChild(div);

                new Vue({
                    el: '#fzy-component-popup-form',
                    components: {fzyPopupForm: component},
                    mounted: function() {
                        this.$refs.fzyPopupForm.init(options);
                    },
                });
            }

        },
        /**
         * 根据全局配置和局部配置生成新的配置文件
         * @param pData {Any} 需要显示的项及默认值
         *      Object：覆盖原有属性
         *      其他：赋予默认值
         * @param gData {[Object]} 全局配置项 详见open-options参数
         * @returns {*[]}
         */
        newOptions(pData, gData) {
            var newData = [];
            gData.forEach(function(item) {

                for (let pDataKey in pData) {
                    if (item.value === pDataKey) {
                        if (typeof pData[pDataKey] === 'object' && !Array.isArray(pData[pDataKey])) {
                            for (let nDatumKey in pData[pDataKey]) {
                                item[nDatumKey] = pData[pDataKey][nDatumKey];
                            }
                        } else {
                            item.default = pData[pDataKey];
                        }
                        return newData.push(item);
                    }

                }

            });
            return newData;
        },
    };
    return component;
});
