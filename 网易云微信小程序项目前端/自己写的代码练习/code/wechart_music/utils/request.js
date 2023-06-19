// 发送ajax请求

/* 
    1、封装功能函数

    2、封装功能组件
*/

import config from "./config";

export default (url , data={} , method="GET") => {
    return new Promise((resolve ,reject) => {
        wx.request({
            url: config.mobileHost + url,
            data,
            method,
            header: {
              cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
            },
            success: (res) => {
              // console.log("成功",res);
              if (data.isLogin) { //请求是登录请求
                // 将用户的cookies存到本地
                wx.setStorage({
                  key:'cookies',
                  data:res.cookies
                });
              }
              resolve(res.data);
            },
            fail: (err) => {
              // console.log("失败",err);
              reject(err);
            }
          })
    })
}