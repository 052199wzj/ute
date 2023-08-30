/**
 * 弹框表单
 *
 * methods.open {Function}弹出表单  参数:options
 *
 * OPEN         {Function}弹出表单  参数:options
 *              无Vue环境下可用
 *              可选参数: 传入后调用方式等同于this.$refs调用
 *                  vue-vue         实例
 *                  componentName   组件ref名称
 *
 * newOptions   {Function}  生成配置项
 *              通过全局配置及局部配置生成新的配置项并传入默认值
 *              @param pData {Any} 需要显示的项及默认值
 *                  Object：覆盖原有属性，此时默认值需传入default
 *                  其他：赋予默认值
 *              @param gData {[Object]} 全局配置项
 *              @returns {[]}:options
 *
 * options:
 *  title:标题
 *  confirm:确认按钮的回调函数 返回true时不关闭弹框 参数formData为表单中填写的值
 *  close:取消按钮的回调函数 返回true时不关闭弹框
 *  option表单配置项
 *      通用配置:
 *          label   {String}    标题
 *          value   {String}    当前项对应的KEY值
 *          type    {String}    当前输入框的类型    默认为input
 *                  可选值:    input,password,number,textarea,select,date,time,file-img
 *          rules   {[Object|String]}   验证函数
 *                  String:已封装的验证规则
 *                      required-必传, email-邮箱, phone-手机号
 *                  {regExp:**,message:''}
 *                      正则验证 regExp为正则表达式 message为提示语
 *                  Object:
 *                      可参考 https://github.com/yiminghe/async-validator
 *          default {Array|String|Number}   默认值 不同输入框的类型各不相同
 *          span    {Number}    占用页面宽度 24为100% 默认为12 采用element的栅格布局
 *          disabled{Boolean}   是否禁用    默认为false
 *      select:
 *          multiple    {Boolean}   是否多选   默认false
 *          clearable   {Boolean}   是否可以清空选项    默认false
 *                  *多选状态下返回值为数组 默认值亦为数组
 *          child   {[String]|String}    子级下拉框
 *                  只有一个子级时无需写成数组
 *                  对应子级下拉框的value值,设置后当前下拉框变更后会影响子级下拉框的可选项
 *          far     {String}
 *                  -子级必填  子级受控的值
 *                  当父组件选中值的value等于子组件options[far]时 当前options才会展示
 *          options {[Object]}  下拉框选项
 *                  label-下拉框选项显示的值
 *                  value-存储在formData中的值
 *      date & time：
 *          default:需要可被new Date()解析   date(TimePicker) / string(TimeSelect)
 *      file-img:
 *          limit:最大图片数量
 *          default:    格式[{url:'***'}]
 */

/*
完整实例:

<fzy-popup-form ref="myForm"></fzy-popup-form>

var gData = [
    {
        label: '姓名', value: 'name',
    },
    { label: '密码', value: 'password', type: 'password' },
    { label: '邮箱', value: 'email', type: 'input', rules: [ 'email' ] },
    { label: '手机号', value: 'phone', rules: [ 'phone' ] },
    { label: '数字', value: 'number', type: 'number' },
    {
        label: '性别', value: 'sex', type: 'select', default: 1,
        clearable: true, rules: [ 'array' ],
        options: [ { label: '男', value: 0 }, { label: '女', value: 1 } ],
    },
    { label: '备注', value: 'note', type: 'textarea', span: 24 },
    {
        label: '状态', value: 'state', type: 'select',
        clearable: true, multiple: true,
        options: [
            { label: '开机', value: 0 },
            { label: '关机', value: 1 },
            { label: '警报', value: 2 },
            { label: '维修中', value: 3 },
        ],
    },
    {
        label: '父级', value: 'father', type: 'select',
        clearable: true, child: 'child',
        options: [ { label: '0', value: 0 }, { label: '1', value: 1 } ],
    },
    {
        label: '子级', value: 'child', type: 'select', far: 'value',
        multiple: true, filterable: true, child: [ 'child2', '123' ],
        options: [
            { label: '父级0-自身0', value: 0}, { label: '父级0-自身1', value: 1},
            { label: '父级1-自身2', value: 2}, { label: '父级1-自身3', value: 3 },
        ],
    },
    {
        label: '孙级', value: 'child2', type: 'select', far:'value',
        options: [
            { label: '父级0-自身0', value: 0}, { label: '父级0-自身1', value: 1 },
            { label: '父级1-自身2', value: 2 }, { label: '父级1-自身3', value: 3 },
            { label: '父级2-自身4', value: 4 }, { label: '父级2-自身3', value: 4 },
            { label: '父级3-自身5', value: 5 }, { label: '父级3-自身6', value: 6 },
        ],
    },
    { label: '日期', value: 'date', type: 'date', default: new Date() },
    { label: '时间', value: 'time', type: 'time', default: new Date() },
    {
        label: '图片',
        value: 'fileImg',
        type: 'file-img',
        default: [
            { url: '/iPlantSCADA/upload/2021/08/09/135624_79e92561-7e86-4dff-b156-e79b683a93c0.png' },
        ],
        limit: 3,
        span: 24,
    },
    {
        label: '图片2',
        value: 'fileImg1',
        type: 'file-img',
        limit: 1,
        span: 24,
    },
];
var pData = {
    name: '',
    email: '',
    state: '',
    note: '',
    time: '',
};

$test.OPEN({
     title: '这是标题',
     option: $test.newOptions(pData, gData),
     confirm: function(formData){
         console.log(JSON.stringify(formData));
     },
     close: function(){
     },
});

this.$refs.myForm.open({
    title: '这是标题',
    option: gData,
    confirm: function(formData){
        console.log('确认回调');
        console.log(JSON.stringify(formData));
        return true;
    },
    close: function(){
        console.log('取消回调');
    },

});
 */

// todo:date time 待完善; datetime暂未实现
// time: picker-options is-range clearable
// data: picker-options type range-separator clearable

define([
    '../../../../js/base/vue-element',
    '../../../../js/base/base',
], function(Vue, $com){
    var template = `
        <el-dialog 
        :title="title" 
        :visible.sync="show"
        :close-on-click-modal="false"
        top="5vh"
        append-to-body
        :width="style.dialogWidth"
        class="fzy-popup-form"
    > 
        <div 
            v-if="show"
            style="
                padding: 0 20px;
                overflow-y:auto;
                overflow-x:hidden;
                max-height: 60vh;
            "
            class="fzy-scroll-hide"
        >
            <el-form 
            ref="myForm"
            :model="formData" 
            :rules="rules"
            :label-position="style.labelPosition"
            :label-width="style.labelWidth"
            size="medium" 

        >
            <el-row :gutter="30">
                <el-col 
                    v-for="item in formOptions"
                    :key="item.value"
                    :span="item.span"
                >
                    <el-form-item 
                        :label="item.label"
                        :prop="item.value"
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
                                filterable
                                :multiple="item.multiple"
                                style="width:100%;"
                                @change="fatherChange(item)"
                            >
                                <el-option 
                                    v-for="option in item.newOptions || item.options""
                                    :label="option.Name" 
                                    :value="option.ID"
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
                        
                        <!--图片上传-->
                        <template v-if="item.type==='file-img'">
                            <el-upload
                                :http-request="function(file){ uploadFileImg(file,item) }"
                                :file-list="formData[item.value]"
                                :limit="item.limit"
                                accept=".jpg,.png,.gif,.bmp,.jpeg"
                                list-type="picture-card"
                                :disabled="item.disabled"
                                multiple
                            >
                                <i  slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{file}">
                                    <img
                                        class="el-upload-list__item-thumbnail"
                                        :src="file.url" alt=""
                                    >
                                    <span class="el-upload-list__item-actions">
                                        <span
                                            class="el-upload-list__item-preview"
                                            @click="handlePictureCardPreview(file)"
                                        >
                                            <i class="el-icon-zoom-in"></i>
                                        </span>
                                        <span
                                            v-if="!item.disabled"
                                            class="el-upload-list__item-delete"
                                            @click="handleRemoveImg(file,item)"
                                        >
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                            <el-dialog 
                                :visible.sync="fileImgData.dialogVisible" 
                                append-to-body 
                                top="10vh"
                                width="80vh"
                            >
                                <img width="100%" :src="fileImgData.dialogImageUrl" alt="">
                            </el-dialog>
                        </template>
                        
                        <!--文本内容-->
                        <template v-if="item.type==='text'">
                            <span>{{ formData[item.value] }}</span>
                        </template>
                        
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" v-if="!style.hideConfirm" @click="confirm" style="background: #50bcf6;border-color:#50bcf6 ">确 定</el-button>
        </div>
             
    </el-dialog>
    `;
    var http = {
        //上传图片
        postUploadImage: function(data, fn, context){
            var d = {
                $URI: '/Upload/Submit',
                $TYPE: 'POST',
            };

            function err(){
                $com.app.tip('上传失败，请检查网络');
            }

            $com.app.ajax_load($.extend(data, d), fn, err, context);
        },
    };

    function ToolDeepClone(target){
        var result;
        if( typeof target === 'object' ){
            // 数组
            if( Array.isArray(target) ){
                result = [];
                for( var i in target ){
                    result.push(ToolDeepClone(target[i]));
                }
            } else if( target === null ){
                result = null;
            } else if( target.constructor === RegExp ){
                result = target;
            } else{
                // 普通对象
                result = {};
                for( var i in target ){
                    result[i] = ToolDeepClone(target[i]);
                }
            }
        } else{
            result = target;
        }
        return result;
    }

    /**
     * 根据全局配置和局部配置生成新的配置文件
     * @param partData {[Object|Array|String]} 需要显示的项及默认值
     *      Object：覆盖原有属性
     *      其他：赋予默认值
     * @param gData {[Object]} 全局配置项 详见open-options参数
     * @returns {*[]}
     */
    function newOptions(partData, globalData){

        var pData = ToolDeepClone(partData);
        var gData = ToolDeepClone(globalData);

        var newData = [];
        gData.forEach(function(item){
            for( var pDataKey in pData ){
                if( item.value === pDataKey ){
                    if( typeof pData[pDataKey] === 'object' && !Array.isArray(pData[pDataKey]) ){
                        for( var nDatumKey in pData[pDataKey] ){
                            item[nDatumKey] = pData[pDataKey][nDatumKey];
                        }
                    } else{
                        item.default = pData[pDataKey];
                    }
                    return newData.push(item);
                }
            }

        });
        return newData;
    }

    /**
     * 等同于methods.open()
     * @param options
     * @constructor
     *     无Vue环境下可用
     *     可选参数: 传入后调用方式等同于this.$refs调用
     *         vue             实例
     *         componentName   组件ref名称
     */
    function OPEN(options){
        if( options.vue && options.componentName ){
            options.vue.$refs[options.componentName].open(options);
        } else{
            var div = document.createElement('div');
            div.id = 'fzy-component-popup-form';
            div.innerHTML = '<fzy-popup-form ref="fzyPopupForm"></fzy-popup-form>';

            var popupForm = document.getElementById('fzy-component-popup-form');
            popupForm && document.body.removeChild(popupForm);
            document.body.appendChild(div);

            var vm = new Vue({
                el: '#fzy-component-popup-form',
                components: { fzyPopupForm: component },
                mounted: function(){
                    this.$refs.fzyPopupForm.open(options);
                },
            });
            return vm.$refs['fzyPopupForm'].open;
        }

    }

    var component = {
        name: 'fzyPopupForm',
        template: template,
        data: function(){
            return {
                show: false,
                style:{},
                title: '',
                rules: {}, // 验证规则
                formData: {}, // 表单数据
                formOptions: [], // 表单项
                //回调函数
                callback: {
                    confirm: null, // 确认
                    close: null, // 取消
                },
                // 查看大图
                fileImgData: {
                    dialogVisible: false,
                    dialogImageUrl: '',
                },
            };
        },
        methods: {
            open: function(options){
                var that = this;

                // 初始化组件
                that.style={
                    dialogWidth:'750px',
                    labelPosition:'top',
                    labelWidth:'100px',
                }
                that.title = '';
                that.rules = [];
                that.formData = {};
                that.formOptions = [];
                that.callback = { confirm: null, close: null };

                // style
                if( options.style ){
                    // 弹框宽度
                    that.style.dialogWidth = options.style.dialogWidth || '750px';
                    // label位置
                    that.style.labelPosition = options.style.labelPosition || 'top';
                    // label宽度
                    that.style.labelWidth = options.style.labelWidth || '100px'
                    // 隐藏确认按钮
                    that.style.hideConfirm = options.style.hideConfirm || false
                }

                // 回调函数
                if( !that.style.hideConfirm && typeof options.confirm !== 'function' ){
                    console.error('"confirm" is not a function');
                    return false;
                }
                if( options.close && typeof options.close !== 'function' ){
                    console.error('"close" is not a function');
                    return false;
                }
                that.callback.confirm = options.confirm;
                that.callback.close = options.close;

                // 生成数据
                var formData = {};     // form data
                var rules = {};      // 验证对象
                options.option.forEach(function(item){
                    // 验证规则
                    rules[item.value] = that.newRule(item);

                    // 赋予属性
                    that.newDefaultOptions(item, options.option);

                    // 生成data
                    formData[item.value] = item.default;

                    // 生成子级下拉框options
                    if( item.child ){
                        item.child.forEach(function(child){
                            options.option.forEach(function(op){
                                if( op.value === child ){
                                    op.newOptions = [];
                                }
                            });
                        });
                    }

                });
                that.formOptions = options.option;
                that.formData = formData; // 输入框数据
                that.rules = rules;//验证规则
                // 用于生成输入框

                // 父级存在默认值时生成子集的可选项
                options.option.forEach(function(item){
                    if( item.type === 'select' && item.child && item.default ){
                        that.fatherChange(item);
                    }
                });
                // 给formData赋值
                options.option.forEach(function(item){
                    that.formData[item.value] = item.default;
                });

                that.title = options.title; // 标题

                that.show = true; // 显示
                this.$nextTick(function(){
                    that.$refs['myForm'].resetFields();
                });
            },
            // 关闭按钮  --  返回值为true时不关闭
            close: function(){
                if( this.callback.close ){
                    this.callback.close() || ( this.show = false );
                } else{
                    this.show = false;
                }
            },
            // 确认按钮  --  返回值为true时不关闭
            confirm: function(){
                var that = this;
                that.$refs['myForm'].validate(function(bool){
                    if( !bool ) return false;

                    var formData = $com.util.Clone(that.formData);
                    // 需要特殊处理的返回值
                    that.formOptions.forEach(function(option){
                        switch( option.type ){
                            case 'file-img':
                                var arr = [];
                                formData[option.value].forEach(function(item){
                                    arr.push(item.url);
                                });
                                formData[option.value] = arr;
                                break;
                            default :
                                break;
                        }
                    });

                    that.callback.confirm(formData, that.$refs['myForm']) || ( that.show = false );
                });
            },
            // 生成验证规则
            newRule: function(option){
                var that = this;
                if( !option.rules ) return [];
                var rules = [];
                option.rules.forEach(function(rule){
                    if( typeof rule === 'string' ){
                        switch( rule ){
                            case 'required':
                                rules.push({
                                    required: true,
                                    message: '请输入' + option.label,
                                    trigger: option.type === 'select' ? [ 'change' ] : [ 'blur' ],
                                });
                                break;
                            case 'email':
                                rules.push({
                                    type: 'email', message: '请输入正确的邮箱地址', trigger: [ 'blur' ],
                                });
                                break;
                            case 'phone':
                                rules.push({
                                    pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: [ 'blur' ],
                                });
                                break;
                            default:
                                console.warn(rule + '规则不存在');
                                console.warn(option);
                                break;
                        }
                    } else if( rule['regExp'] ){
                        rules.push({
                            pattern: rule['regExp'], message: rule.message, trigger: [ 'blur' ],
                        });
                    } else{
                        rule.$data = that.$data;
                        rules.push(rule);
                    }
                });
                return rules;
            },
            // 赋予默认属性
            newDefaultOptions: function(option, options){
                // 默认为input
                option.type = option.type || 'input';
                // 默认提示语,特殊情况后续覆盖
                option.placeholder = '请选择' + option.label;

                switch( option.type ){
                    case 'input':
                    case 'password':
                        option.placeholder = '请输入' + option.label;
                        break;
                    case 'textarea':
                        option.placeholder = '请输入' + option.label;
                        option.span = option.span || 24;
                        break;
                    case 'select':
                        // 多选
                        if( option.multiple ){
                            option.default = option.default || [];
                            if( !Array.isArray(option.default) ){
                                console.error('default is not Array');
                                return false;
                            }
                        }
                        // 存在子级
                        if( option.child ){
                            // 字符串处理为数组
                            if( typeof option.child === 'string' ){
                                option.child = [ option.child ];
                            }
                            // 检测子级是否存在
                            option.child.forEach(function(item){
                                var isErr = options.filter(function(opt){
                                    return opt.value === item;
                                }).length === 0;
                                if( isErr ){
                                    console.warn('Can\'t find the child: ' + item);
                                    console.warn(option);
                                }
                            });
                        }
                        break;
                    case 'file-img':
                        option.span = option.span || 24;
                        option.default = option.default || [];
                        break;
                    case 'date':
                    case 'time':
                        option.default = option.default
                                         ? new Date(option.default)
                                         : '';
                        if( option.default.toString() === 'Invalid Date' ){
                            console.warn('The default value of ' + option.value + ' is not a Date');
                            console.warn(option);
                        }
                        break;
                    default:
                        break;
                }

                // 输入框默认宽度  24为100%
                option.span = option.span || 12;
            },
            // select   父级下拉框变化
            fatherChange: function(e){
                if( !e.child ) return false;

                var that = this;
                var value = this.formData[e.value];
                var childs = e.child;

                childs.forEach(function(child){

                    // 清空子级的值
                    that.formData[child] = undefined;

                    that.formOptions.forEach(function(op){
                        if( Array.isArray(value) ){
                            // 不符合条件,跳过本次循环
                            if( childs.indexOf(op.value) === -1 ) return false;

                            // 更新子级options
                            op.newOptions = op.options.filter(function(item){
                                return value.indexOf(item[op.far]) !== -1;
                            });
                            // 更新孙级
                            that.fatherChange(op);
                        } else{
                            if( op.value !== child ) return false;

                            op.newOptions = op.options.filter(function(item){
                                return item[op.far] === value;
                            });

                            that.fatherChange(op);


                        }
                    });

                });


            },
            // file-img 删除图片
            handleRemoveImg: function(file, option){
                var that = this;
                that.formData[option.value] = that.formData[option.value].filter(function(item){
                    return item.uid !== file.uid;
                });
            },
            // file-img 上传图片
            uploadFileImg: function(file, option){
                var that = this;
                var form = new FormData();
                form.append('files', file.file);
                http.postUploadImage(form, function(res){
                    that.formData[option.value].push({
                        url: res.file_url,
                    });
                });
            },
            // file-img 查看大图
            handlePictureCardPreview: function(file){
                this.fileImgData.dialogImageUrl = file.url;
                this.fileImgData.dialogVisible = true;
            },
            newOptions: newOptions,
        },
        OPEN: OPEN,
        newOptions: newOptions,

    };
    return component;
});
