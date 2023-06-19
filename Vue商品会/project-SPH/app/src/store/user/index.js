import { reqGetCode, reqLogout, reqUserInfo, reqUserLogin, reqUserRegister } from "@/api";
import { setToken, getToken, removeToken } from "@/utils/token";

// 登录与注册的模块
const state = {
    code: '', // 验证码
    token: getToken(), // 用户的唯一标识
    // token:'', // 直接在request里面调用本地存储的token使用
    userInfo: {}, // 用户信息
};
const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        // 获取验证码这个接口，会直接把验证码返回
        // 正常情况下，验证码会发到用户手机上，这个功能后端做
        let result = await reqGetCode(phone);
        if (result.code == 200) {
            commit('GETCODE', result.data);
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'));
        }

    },

    // 用户注册
    async userRegister({ }, data) {
        let result = await reqUserRegister(data);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('fail'));
        }

    },

    // 登陆业务（token）
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data);
        // 服务器下发token
        if (result.code == 200) {
            commit("USERLOGIN", result.data.token);
            // 为了解决刷新token丢失的问题，把token存储到本地
            // localStorage.setItem('TOKEN',result.data.token);
            setToken(result.data.token);
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'));
        }

    },

    // 获取用户信息
    async getUserInfo({ commit }) {
        let result = await reqUserInfo();
        if (result.code == 200) {
            commit('GETUSERINFO', result.data);
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'));
        }
    },

    // 退出登录
    async userLogout({commit}){
        // 向服务器发请求,让服务器清除token
        let result = await reqLogout();
        if(result.code == 200){
            commit('CLEAR');
            return 'ok';
        }else{
            return Promise.reject(new Error('fail'));
        }
    }
};
const mutations = {
    // 验证码
    GETCODE(state, code) {
        state.code = code;
    },
    // 用户的唯一标识
    USERLOGIN(state, token) {
        state.token = token;
    },
    // 服务器返回的用户信息
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    // 清除本地的数据
    CLEAR(state){
        // 把仓库里相关的用户信息清空
        state.token = "";
        state.userInfo = {};
        // 本地存储数据清空
        removeToken();
    }
};
const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
}