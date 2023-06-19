// 将所有的api接口，进行统一的管理

import requests from "./request";
import mockRequest from './mockRequest'

// 三级联动的接口  get  无参数
// http://gmall-h5-api.atguigu.cn/api/product/getBaseCategoryList

export const reqCategoryList = ()=>{
    // 发请求，返回Promise对象
    return requests({
        url:'/product/getBaseCategoryList',
        method:'get'
    })
};

// 获取轮播图的接口
// 简写形式
export const reqGetBannerList = ()=>mockRequest.get('/banner');

// 获取floor数据
export const reqFloorList = ()=>mockRequest.get('/floor');

// 获取搜索模块的数据
// 地址/api/list    请求方式: post
// 请求要带参数
/* 示例
{
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
*/
// 当前接口给服务器传参,最少也是{}空对象
export const reqGetSearchInfo = (params)=>requests({
    url:'/list',
    method:'post',
    data:params
});

// 获取商品详情信息的接口
// URL: /api/item/{ skuid } 请求方式：get
export const reqGoodsInfo = (skuId)=>requests({
    url:`/item/${skuId}`,
    method:'get'
});

// 将产品添加到购物车中（获取更新某一个产品的个数）
//  /api/cart/addToCart/{skuid}/{skuNum}  POST
export const reqAddOrUpdateShopCart = (skuId,skuNum) => requests({
    url:`/cart/addToCart/${skuId}/${skuNum}`,
    method:'post'
});

// 获取购物车列表的数据接口
// URL: /api/cart/cartList      method: get
export const reqCartList = ()=>requests({
    url:'/cart/cartList',
    method:'get'
});

// 删除购物车产品的接口
// URL：/api/cart/deleteCart/{skuId}  method: DELETE
export const reqDeleteCartById = (skuId)=>requests({
    url:`/cart/deleteCart/${skuId}`,
    method:'delete'
});

// 修改购物车勾选状态的接口
// URL: /api/cart/checkCart/{skuId}/{isChecked} method:GET
export const reqCheckedCartById = (skuId,isChecked)=>requests({
    url:`/cart/checkCart/${skuId}/${isChecked}`,
    method:'get'
});

// 获取验证码
// URL: /api/user/passport/sendCode/{phone} method:get
export const reqGetCode = (phone)=>requests({
    url:`/user/passport/sendCode/${phone}`,
    method:'get'
});

// 注册的接口
// URL: /api/user/passport/register method:post  phone code password
export const reqUserRegister = (data)=>requests({
    url:`/user/passport/register`,
    data,
    method:'post'
});

// 登录的接口
// URL: /api/user/passport/login method:post phone password
export const reqUserLogin = (data)=>requests({
    url:'/user/passport/login',
    data,
    method:'post'
});

// 获取用户的信息（需要带着用户的token向服务器要用户的信息）
// URL: /api/user/passport/auth/getUserInfo method:get
export const reqUserInfo = ()=>requests({
    url:'/user/passport/auth/getUserInfo',
    method:'get'
});

// 退出登录
// URL: /api/user/passport/logout get
export const reqLogout =()=>requests({
    url:'/user/passport/logout',
    method:'get'
});

// 获取用户地址信息
// URL: /api/user/userAddress/auth/findUserAddressList  method:get
export const reqAddressInfo = ()=>requests({
    url:'/user/userAddress/auth/findUserAddressList',
    method:'get'
});

// 获取商品清单
// URL: /api/order/auth/trade method:get
export const reqOrderInfo = ()=>requests({
    url:'/order/auth/trade',
    method:'get'
});

// 提交订单的接口
// URL：/api/order/auth/submitOrder?tradeNo={tradeNo} method:post
export const reqSubmitOrder = (tradeNo,data)=>requests({
    url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method:'post'
});

// 获取支付信息
// URL:/api/payment/weixin/createNative/{orderId}  GET
export const reqPayInfo = (orderId)=>requests({
    url:`/payment/weixin/createNative/${orderId}`,
    method:'get'
});

// 获取支付订单状态
// URL:/api/payment/weixin/queryPayStatus/{orderId} GET
export const reqPayStatus = (orderId)=>requests({
    url:`/payment/weixin/queryPayStatus/${orderId}`,
    method:'get'
});

// 获取个人中心的数据
// URL:/api/order/auth/{page}/{limit} GET
export const reqMyOrderList = (page,limit)=>requests({
    url:`/order/auth/${page}/${limit}`,
    method:'get',
})