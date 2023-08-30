/**
 * 弹框表单 1.1 使用文档
 *
 * methods.FormOptions {Constructor} 生成配置项实例
 *      @param options{Object} 全局配置项 详见option列表
 *
 * FormOptions.newOptions {Function} 通过局部配置生成配置项实例
 *      @param options {[String] | Object} 局部配置项
 *
 *      [String]:
 *          当参数为string数组时 则弹框仅显示数组中包含的表单项
 *          String对应options的key值
 *      Object :
 *          key:对应options的key值 表示会展示当前项
 *          value:
 *              String|Array:
 *                  展示当前属性并赋予默认值
 *              Object:
 *                  可修改全局配置中的任何属性
 *                  此时赋予默认值需通过default
 *
 *
 * PopupForm {Constructor} 实例化popup form 组件
 *      @param options{Object} 全局配置项 详见option列表
 *
 * PopupForm.open{Function}
 *      @param options{title:{String},option:{Object,Array},confirm:{Function},close:{Function}}
 *      同 methods.open
 *      option - 可选项
 *          不传入:    默认为PopupForm实例化时的option项
 *          传入:     自动执行FormOptions.newOptions操作 参数同 FormOptions.newOptions
 *
 * methods.open {Function} 弹出表单
 *      @param options{title:{String},option:{Object},confirm:{Function},close:{Function}}
 *      title:      标题
 *      option:     配置项 详见option列表
 *      confirm:    点击确认按钮的回调函数     - return true 则弹框不会关闭
 *      close:      点击取消按钮的回调函数     - return true 则弹框不会关闭   可选项
 *
 */

/**
 * option 配置项 {Object}:
 *  key:表示当前项对应的变量名
 *  value:
 *      通用配置
 *          label   {String}    标题
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
 *
 *      select:
 *          default     多选状态下返回值为数组 默认值亦为数组
 *          multiple    {Boolean}   是否多选   默认false
 *          clearable   {Boolean}   是否可以清空选项    默认false
 *          child   {[String]|String}    子级下拉框
 *                  只有一个子级时无需写成数组
 *                  对应子级下拉框的value值,设置后当前下拉框变更后会影响子级下拉框的可选项
 *          far     {String}
 *                  -子级必填  子级受控的变量名
 *                  当父组件选中值的value等于子组件options[far]时 当前options才会展示
 *          options {[Object]}  下拉框选项
 *                  label-下拉框选项显示的值
 *                  value-存储在formData中的值
 *
 *      date | time：
 *          default:需要可被new Date()解析   date(TimePicker) / string(TimeSelect)
 *
 *      file-img:
 *          limit:最大图片数量
 *          default:    格式[{url:'***'}]
 */

/*
    非vue环境示例:
    var fzyPopupForm = new $popupForm.PopupForm({
        Code: '基地编码',Name: '基地名称',Remark: { label: '基地描述', type: 'textarea' }
    });
    fzyPopupForm.open({
        title:'添加',
        confirm:function(e){console.log(e)}
    })
    fzyPopupForm.open({
        title: '修改',
        option: { Code:'AT-11', Name:'广州地铁', Remark:'描述' },
        confirm: function(e){console.log(e)}
    })
*/

/*
    vue环境示例:
    <fzy-popup-form ref="myPopupForm"></fzy-popup-form>
    data:{ formOptions:{} }
    mounted(){
        this.formOptions = new this.$refs['myPopupForm'].FormOptions({
            Code: '基地编码',Name: '基地名称',Remark: { label: '基地描述', type: 'textarea' }
        })
    },
    methods:{
        add(){
            this.$refs['myPopupForm']({
                title:'添加',
                option:this.formOptions,
                confirm:function(e){console.log(e)}
            })
        },
        edit(data){
            this.$refs['myPopupForm']({
                title:'修改',
                option:this.formOptions.newOptions({Code:'AT-11', Name:'广州地铁', Remark:'描述' }),
                confirm:function(e){console.log(e)}
            })
        }
    }

 */


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
        width="900px"
        class="fzy-popup-form"
    > 
        <div 
            v-if="show"
            style="
                padding: 0 10px;
                overflow-y:auto;
                overflow-x:hidden;
                max-height: 60vh;
            "
            class="fzy-scroll-hide"
        >
            <el-form 
            ref="form"
            :model="formData" 
            :rules="rules"
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
                                collapse-tags
                                filterable
                                :multiple="item.multiple"
                                style="width:100%;"
                                @change="fatherChange(item)"
                            >
                                <el-option 
                                    v-for="(option,index) in item.newOptions || item.options""
                                    :key="index"
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
                        
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
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

    // 工具函数
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

    // 实例化 options - Vue环境下使用
    function FormOptions(options){
        for( let key in options ){
            this[key] = options[key];
        }
    }

    FormOptions.prototype.newOptions = function(partData){
        var pData = partData;
        var gData = ToolDeepClone(this);

        var newData = {};

        if( Array.isArray(pData) ){
            for( let key of pData ){
                newData[key] = gData[key];
            }
        } else{
            for( let gDataKey in gData ){
                var g = gData[gDataKey];
                if( typeof g === 'string' ) g = { label: g };
                for( let pDataKey in pData ){
                    var p = pData[pDataKey];
                    if( gDataKey === pDataKey ){
                        if( typeof p === 'object' && !Array.isArray(p) )
                            for( var key in p ){ g[key] = p[key]; }
                        else
                            g.default = p;

                        newData[gDataKey] = g;
                    }
                }
            }
        }
        return newData;
    };

    // 实例化popup form 组件 - 非Vue环境下使用
    function PopupForm(option){
        this.option = new FormOptions(option);
    }

    PopupForm.prototype.open = function(options){
        var ops = ToolDeepClone(options);
        ops.option = ops.option
                     ? this.option.newOptions(ops.option)
                     : this.option;

        var div = document.createElement('div');
        div.id = 'fzy-component-popup-form';
        div.innerHTML = '<fzy-popup-form ref="fzyPopupForm"></fzy-popup-form>';

        var popupForm = document.getElementById('fzy-component-popup-form');
        popupForm && document.body.removeChild(popupForm);
        document.body.appendChild(div);

        var vm = new Vue({
            el: '#fzy-component-popup-form',
            components: { fzyPopupForm: fzyPopupForm },
            mounted: function(){
                this.$refs.fzyPopupForm.open(ops);
            },
        });
    };

    var fzyPopupForm = {
        name: 'fzyPopupForm',
        template: template,
        data: function(){
            return {
                show: false,
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
            FormOptions: FormOptions,
            open: function(options){
                var ops = options.option; // form
                var formData = {}; // 输入框数据
                var rules = {}; // 验证规则

                // 初始化组件
                this.formData = {};
                this.formOptions = [];
                this.rules = [];
                this.title = '';
                this.callback = { confirm: null, close: null };

                // 回调函数
                if( typeof options.confirm !== 'function' ){
                    return console.error('"confirm" is not a function');
                }
                if( options.close && typeof options.close !== 'function' ){
                    return console.error('"close" is not a function');
                }
                this.callback.confirm = options.confirm;
                this.callback.close = options.close;

                // 生成数据
                for( var key in ops ){
                    if( !ops.hasOwnProperty(key) ) continue;

                    // 将str转换为普通input框
                    if( typeof ops[key] === 'string' ) ops[key] = { label: ops[key] };
                    // 添加value(formData中对应的变量名)用于数据处理
                    ops[key].value = key;

                    // 验证规则
                    rules[key] = this.newRule(ops[key]);

                    // 赋予属性
                    this.newDefaultOptions(ops[key], ops);

                    // 生成data
                    formData[key] = ops[key].default;
                    // 生成子级下拉框options
                    if( ops[key].child ){
                        for( var child of ops[key].child ){
                            for( var key in ops ){
                                if( key === child ){
                                    ops[key].newOptions = [];
                                }
                            }
                        }
                    }
                }

                this.rules = rules;
                this.formOptions = ops;


                this.formData = formData;// todo ?
                // for( let key in this.formData )
                // delete this.formData[key];
                // Object.assign(this.formData, formData);

                // 父级存在默认值时生成子级的可选项
                for( var key in ops ) this.fatherChange(ops[key], true);


                this.title = options.title;
                this.show = true; // open
                this.$nextTick(function(){
                    this.$refs['form'].resetFields();
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
                that.$refs['form'].validate(function(bool){
                    if( !bool ) return false;

                    var formData = ToolDeepClone(that.formData);
                    // 需要特殊处理的返回值
                    for( let key in that.formOptions ){
                        var option = that.formOptions[key];

                        switch( option.type ){
                            case 'file-img':
                                var arr = [];
                                formData[key].forEach(function(item){
                                    arr.push(item.url);
                                });
                                formData[key] = arr;
                                break;
                            default :
                                break;
                        }
                    }

                    that.callback.confirm(formData) || ( that.show = false );
                });
            },
            // 生成验证规则
            newRule: function(option){
                if( !option.rules ) return [];
                var rules = [];
                for( let rule of option.rules ){
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
                                    pattern: /^1[3-9]d{9}$/, message: '请输入正确的手机号码', trigger: [ 'blur' ],
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
                        rules.push(rule);
                    }
                }
                return rules;
            },
            // 赋予默认属性
            newDefaultOptions: function(option, options){
                // 默认为input
                option.type = option.type || 'input';
                // 默认提示语,特殊情况后续覆盖
                option.placeholder = '请输入' + option.label;

                switch( option.type ){
                    case 'input':
                        break;
                    case 'textarea':
                        option.span = option.span || 24;
                        break;
                    case 'select':
                        option.placeholder = '请选择' + option.label;
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
                            for( let item of option.child ){
                                if( !options[item] ){
                                    console.warn('Can\'t find the child: ' + item);
                                    console.warn(option);
                                }
                            }
                        }
                        break;
                    case 'file-img':
                        option.placeholder = '请选择' + option.label;
                        option.span = option.span || 24;
                        option.default = option.default || [];
                        break;
                    case 'date':
                    case 'time':
                        option.placeholder = '请选择' + option.label;
                        option.default = option.default && new Date(option.default);
                        if( String(option.default) === 'Invalid Date' ){
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
            fatherChange: function(e, isRetain){
                if( e.type !== 'select' || !e.child ) return false;
                var that = this;
                var value = this.formData[e.value];
                var childs = e.child;

                for( var child of childs ){
                    // 清空子级的值
                    if( !isRetain ) that.formData[child] = undefined;

                    var fops = that.formOptions;
                    for( var key in fops ){
                        if( Array.isArray(value) ){
                            // 不符合条件,跳过本次循环
                            if( childs.indexOf(fops[key].value) === -1 ) continue;

                            // 更新子级options
                            fops[key].newOptions = fops[key].options.filter(function(item){
                                return value.indexOf(item[fops[key].far]) !== -1;
                            });
                            // 递归更新孙级
                            that.fatherChange(fops[key]);
                        } else{
                            if( fops[key].value !== child ) continue;
                            fops[key].newOptions = fops[key].options.filter(function(item){
                                return item[fops[key].far] === value;
                            });
                            that.fatherChange(fops[key]);

                        }
                    }
                }
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
        },
        PopupForm: PopupForm, // 非Vue环境下使用
    };
    return fzyPopupForm;
});