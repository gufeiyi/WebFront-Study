import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter , anyRoutes ,asyncRoutes , constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 服务器返回的菜单信息
    routes:[],
    buttons:[],
    roles:[],
    // 对比之后需要展示的路由列表【服务器返回的路由和异步路由比较】
    resultAsyncRoutes:[],
    // 用户要展示的所有路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储state
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state,userInfo) => {
    // 用户名
    state.name = userInfo.name;
    // 用户头像
    state.avatar = userInfo.avatar;
    // 菜单权限标记
    state.routes = userInfo.routes;
    // 按钮权限标记
    state.buttons = userInfo.buttons;
    // 角色
    state.roles = userInfo.roles;
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state,asyncRoutes)=>{
    // 存储异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 除了异步路由还需要有常量和任意路由，把能展示的全部路由都拼起来
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    // 给路由添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构用户名和密码
    const { username, password } = userInfo;
    const result = await login({ username: username.trim(), password: password });
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('fail'));
    }

    // if(result.code == 20000)
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 返回数据包括：用户名name、用户头像avatar、routes[返回的标志：不同的用户应该展示哪些菜单的标记]
        // roles：用户角色信息
        // buttons：按钮的信息、按钮权限用的标记 
        const { data } = response;
        // vuex存储用户全部的信息
        commit('SET_USERINFO',data);
        // 计算异步路由
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes));

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes,routers)=>{
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // 没有这个元素，返回索引值-1 ，有则返回索引值
    if(routers.indexOf(item.name)!=-1){
      // 也需要判断子路由是否有权限 2 3 4 5...级路由是否有权限
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routers);
      }
      return true;
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

