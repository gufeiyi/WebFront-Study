// pages/login/login.js
/* 

  登录流程
  1、收集表单数据
  2、前端验证
        用户信息（账号，密码）是否合法
        前端验证不通过提示用户，不需要发请求给后端
        前端验证通过，携带用户名密码给服务器
  3、后端验证
        验证用户是否存在
        用户不存在，告诉前端
        用户存在，验证密码是否正确
        密码不正确，告诉前端
        密码正确，告诉前端登陆成功并返回用户的相关信息
*/
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',  //手机号
    password:''  //用户的密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调函数
  handleInput(event){
    // 我们在标签中写的id会存放到event.target中
    // let type = event.currentTarget.id; //type是变量，取值有俩，phone||password
    let type = event.currentTarget.dataset.type
    this.setData({
      [type]:event.detail.value
    })
  },

  // 登录的回调
 async login(){
    // 获取表单数据
    let {phone , password} = this.data;
    // 前端验证
   /*  
      手机号验证
      1、内容为空
      2、手机号格式不正确 
      3、手机号正确验证通过
      */

      if(!phone){
        // wx.showToast是微信的提示框
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        });
        return;
      }

      // 定义一个正则表达式
      // \d表示任意数字
      // {9}代表要有随意的9位数字
      let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if(!phoneReg.test(phone)){
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none'
        });
        return;
      }

      // 验证一下密码
      if (!password) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none'
        })
        return;
      }

      // 后端验证
      let result = await request('/login/cellphone', {phone,password, isLogin:true})
      if (result.code === 200) {  //登陆成功
        wx.showToast({
          title: '登陆成功'
        });

        // 将用户的信息存储到本地
        wx.setStorageSync('userInfo', JSON.stringify(result.profile));

        // 跳转至个人中心的页面
        // reLaunch函数，把当前所有的页面销毁，跳转到指定页面，可以跳转到bar页面
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
      }else if(result.code === 400){
        wx.showToast({
          title: '手机号错误',
          icon:'none'
        })
      }else if(result.code === 502){
        wx.showToast({
          title: '密码错误',
          icon:'none'
        })
      }else{
        wx.showToast({
          title: '登录失败，请重新登录',
          icon:'none'
        })
      }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})