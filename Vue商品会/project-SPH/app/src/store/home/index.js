// home的仓库

import { reqCategoryList,reqGetBannerList,reqFloorList } from "@/api";

// state: 仓库存储数据
// mutations: 仓库修改数据的方法
// action: 仓库服务员
// getters: 计算属性，让组件更方便获取仓库数据
const state = {
    // 服务器返回对象，起始值为对象，服务器返回数组，起始值为数组
    categoryList:[],
    // 用来存储轮播图的数据
    bannerList:[],
    // floor组件的数据
    floorList:[],
};
const actions = {
    // 参数写{commit}，指的是直接取上下文中的commit属性
    async categoryList({commit}){
        let result = await reqCategoryList();
        if (result.code == 200) {
            commit('CATEGORYLIST',result.data);
        }
    },

    // 获取首页轮播图的数据
    async getBannerList({commit}){
        let result = await reqGetBannerList();
        // console.log(result);
        if(result.code == 200){
            commit('GETBANNERLIST',result.data)
        }
    },

    // 获取Floor数据
    async getFloorList({commit}){
        let result = await reqFloorList();
        if(result.code == 200){
            commit('GETFLOORLIST',result.data);
        }
    }
};
const mutations = {
    CATEGORYLIST(state,categoryList){
        state.categoryList = categoryList;
    },
    GETBANNERLIST(state,bannerList){
        state.bannerList = bannerList;
    },
    GETFLOORLIST(state,floorList){
        state.floorList = floorList;
    }
};
const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
}