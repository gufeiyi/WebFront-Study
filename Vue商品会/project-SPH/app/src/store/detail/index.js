import { reqAddOrUpdateShopCart, reqGoodsInfo } from "@/api";
// 封装的临时游客身份模块uuid  --->生成一个随机字符串
import {getUUID} from '@/utils/uuid_token';
const state = {
    goodInfo:{},
    // 游客的临时身份
    uuid_token:getUUID()
};
const actions = {
    // 获取产品信息的action
    async getGoodInfo({ commit }, skuid) {
        let result = await reqGoodsInfo(skuid);
        if (result.code == 200) {
            commit('GETGOODINFO', result.data);
        }
    },

    // 将产品添加到购物车当中
    async addOrUpdateShopCart({}, {skuId,skuNum}){
        let result = await reqAddOrUpdateShopCart(skuId,skuNum);
        // 服务器只是返回了code = 200 ,代表成功,并没有返回其他数据
        if(result.code == 200){
            return "ok"
        }else{
            return Promise.reject(new Error("fail"));
        }
    }
};
const mutations = {
    GETGOODINFO(state,goodInfo){
        state.goodInfo = goodInfo;
    }
};
const getters = {
    // 路径导航简化
    categoryView(state){
        // goodInfo 可能是 {}
        // {}.categoryView为undefined
        // undefined.category1Name会报错
        return state.goodInfo.categoryView || {};
    },
    // 产品信息简化
    skuInfo(state){
        return state.goodInfo.skuInfo || {};
    },
    // 产品售卖属性简化
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || [];
    }
};
export default {
    state,
    actions,
    mutations,
    getters
}