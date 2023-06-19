import { reqCartList, reqCheckedCartById, reqDeleteCartById } from "@/api";

const state = {
    shopcartList: [],
};

const actions = {
    // 获取购物车列表的数据
    async getShopCart({ commit }) {
        let result = await reqCartList();
        if (result.code == 200) {
            commit('GETSHOPCART', result.data);
        }
    },

    // 删除购物车某一个产品
    async deleteCartListBySkuId({ }, skuId) {
        let result = await reqDeleteCartById(skuId);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('fail'));
        }

    },

    // 修改购物车某一个产品的选中状态
    async updateCheckedById({ }, { skuId, isChecked }) {
        let result = await reqCheckedCartById(skuId, isChecked);
        // console.log(result);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('checked fail'));
        }
    },

    // 删除购物车所有的选中的产品
    deleteAllCheckedCart({ dispatch, getters }) {
        let PromiseAll = [];
        // 获取购物车中全部的产品
        getters.cartList.cartInfoList.forEach(item => {
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : '';
            // 将每一次返回的promise放到promiseAll数组中
            PromiseAll.push(promise);
        });

        // Promise.all如果有一个promise对象的返回值为false，则调用函数返回值为false
        return Promise.all(PromiseAll)
    },

    // 修改全部产品选中的状态
    updateAllCartIsChecked({ dispatch, state }, isChecked) {
        let promiseAll = [];
        // console.log(state);
        state.shopcartList[0].cartInfoList.forEach(item => {
            let promise = dispatch('updateCheckedById', {
                skuId: item.skuId,
                isChecked
            });
            promiseAll.push(promise);
        });
        return Promise.all(promiseAll);
    }
};

const mutations = {
    GETSHOPCART(state, shopcartList) {
        state.shopcartList = shopcartList;
    }
};

const getters = {
    cartList(state) {
        return state.shopcartList[0] || {}
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}