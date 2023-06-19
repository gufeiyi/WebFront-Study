// search 的仓库
import { reqGetSearchInfo } from "@/api";
const state = {
    searchList:{}
};
const actions = {
    // 获取search模块的数据
    // 传递的参数默认是个对象
    async getSearchList({ commit }, params = {}) {
        let result = await reqGetSearchInfo(params);
        if(result.code == 200){
            commit("GETSEARCHLIST",result.data);
        }
    }
};
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList;
    }
};
// 计算属性,为了简化数据
const getters = {
    // 当前仓库中的state
    goodsList(state){
        // 没网申请不到数据的时候返回空数组
        return state.searchList.goodsList||[];
    },
    trademarkList(state){
        return state.searchList.trademarkList||[];
    },
    attrsList(state){
        return state.searchList.attrsList||[];
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}