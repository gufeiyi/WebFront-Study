// vee-validate插件：表单验证区域
import Vue from 'vue';
import VeeValidate from 'vee-validate';
// 引入中文提示信息
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate);

// 表单验证
VeeValidate.Validator.localize('zh_CN',{
    messages: {
        // 提示信息为中文
        ...zh_CN.messages,
        // 修改内置规则的message，让确认密码和密码相同
        is : (field) => `${field}必须与密码相同`
    },
    attributes: {
        phone :'手机号',
        code: '验证码',
        password: '密码',
        password1: '确认密码',
        agree: '同意协议'
    }
});

// 自定义校验规则
VeeValidate.Validator.extend('agree',{
    validate: value => {
        return value
    },
    getMessage: field => field + '必须同意'
})