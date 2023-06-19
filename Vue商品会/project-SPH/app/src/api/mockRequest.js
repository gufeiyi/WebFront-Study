// 对于axios进行二次封装

import axios from "axios";

// 引入进度条
import nprogress from "nprogress";
import "nprogress/nprogress.css";
// 引入进度条的样式
// start：进度条开始
// done：进度条结束

const requests = axios.create({
    // 配置对象

    // 基础路径
    baseURL:'/mock',
    // 请求超时的时间为5s
    timeout:5000,
});

// 请求拦截器，发请求之前的回调
requests.interceptors.request.use((config) => {
    // config:配置对象，有headers请求头
    // 进度条开始动
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