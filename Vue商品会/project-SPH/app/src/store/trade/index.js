// trade 的仓库

import { reqAddressInfo, reqOrderInfo } from "@/api";

const state = {
    userAddress: [],//用户的地址信息
    orderInfo:{},//用户的清单信息
};
const actions = {
    // 获取用户地址信息
    async getUserAddress({ commit }) {
        let result = await reqAddressInfo();
        if (result.code == 200) {
            commit('GETUSERADDRESS', result.data)
        }

    },

    // 获取商品清单的数据
    async getOrderInfo({commit}){
        let result = await reqOrderInfo();
        if(result.code==200){
            commit('GETORDERINFO',result.data);
        }
        
    }
};
const mutations = {
    // 获取用户的地址信息
    GETUSERADDRESS(state, userAddress) {
        state.userAddress = userAddress;
    },

    // 获取用户的清单
    GETORDERINFO(state,orderInfo){
        state.orderInfo = orderInfo;
    }
};
const getters = {};
export default {
    state,
    actions,
    mutations,
    getters
}