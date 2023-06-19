// 配置路由

import Vue from "vue";

import VueRouter from 'vue-router';

import routes from './routes'

// 使用插件
Vue.use(VueRouter)

// 引入store
import store from '@/store'

// 重写push|replace方法
let originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location, resolve, reject) {

    // 使用push函数的时候传递了 reject和resolve，就还用原来的函数
    if (resolve && reject) {
        // 调用call方法是为了维护this指向原本的push方法变成现在新的push方法
        originPush.call(this, location, resolve, reject);
    } else {
        // 这样写就不用每次调用push方法都必须写()=>{},()=>{}这两个参数了
        originPush.call(this, location, () => { }, () => { })
    }
}

let router = new VueRouter({
    // 配置路由
    routes,
    // 滚动行为
    scrollBehavior() {
        // 控制滚动条在最顶部
        return { y: 0 }
    }
})

// 全局守卫: 前置守卫(在路由跳转之前进行判断)
router.beforeEach(async (to, from, next) => {
    // to: 要跳转的路由信息
    // from: 可以获取从哪个路由而来的信息
    // next: 放行
    // next(path) 放行到指定路由
    // next(false);
    // next();
    // 用来判断用户是不是登录
    let token = store.state.user.token;
    // 用来判断是不是页面刷新后用户信息丢失
    let name = store.state.user.userInfo.name
    // 要实现的功能: 1 用户登录之后不可以跳转到登录界面 2 界面刷新之后,仓库里的用户信息不丢失
    // 用户登陆之后携带了token
    if (token) {
        // 禁止到login界面
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            if (name) {
                next();
            } else {
                // 刷新后用户界面丢失,重新向服务器要用户数据
                try {
                    // 获取用户信息成功
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    // token失效了,过期了
                    // 清除token和用户信息
                    await store.dispatch('userLogout');
                    // 让用户重新登陆一下
                    next('/login');
                }
            }
        }
    } else {
        // 用户未登录的处理逻辑
        // 未登录：不能去交易相关（trade）、不能去支付相关（pay|paySuccess）、不能去个人中心（center）
        // 不能去的路由重定向到登录页面
        let toPath = to.path;
        if(toPath.indexOf('/trade')!=-1 || toPath.indexOf('/pay')!=-1 || toPath.indexOf('/center')!=-1){
            // 每次点击to.path会变同时，toPath会跟着变，直接重定向到了home，所以我们要把点击的toPath保存到路由的query参数里面
            next('/login?redirect='+toPath);
        }else{
            // 去的是其他的路由，放行（home/search/shopcart）
            next();
        }
    }
})

export default router;