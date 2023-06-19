// 对于axios进行二次封装

import axios from "axios";

// 引入进度条
import nprogress from "nprogress";
// 在ajax模块引入store
import store from "@/store";
import "nprogress/nprogress.css";
// 引入进度条的样式
// start：进度条开始
// done：进度条结束

const requests = axios.create({
    // 配置对象

    // 基础路径
    baseURL:'/api',
    // 请求超时的时间为5s
    timeout:5000,
});

// 请求拦截器，发请求之前的回调
requests.interceptors.request.use((config) => {
    // config:配置对象，有headers请求头
    // 进度条开始动
    if(store.state.detail.uuid_token){
        // 请求头添加一个字段，需要和后台商量好
        config.headers.userTempId = store.state.detail.uuid_token;
    }
    // 把token带给服务器
    // 方法一: 直接调用localStorage的token,进行请求头的发送
    /* if(localStorage.getItem('TOKEN')){
        // config.headers.token = store.state.user.token;
        // 可以实现每次请求都会在请求头里面发token
        config.headers.token = localStorage.getItem('TOKEN');
    } */

    // 方法二: 使用仓库里的token
    // 这种方法好一点,每个插件和组件都是直接和vuex要数据
    if(store.state.user.token){
        config.headers.token = store.state.user.token;
    }
    nprogress.start();
    return config
});

// 响应拦截器
requests.interceptors.response.use(
    // 成功的回调函数
    (res) => {
        nprogress.done();
        return res.data;
    },
    // 失败的回调函数
    (err) => {
        // reject函数，终结响应函数
        return Promise.reject(new Error('failed'))
    }
)

// 对外暴露
export default requests;