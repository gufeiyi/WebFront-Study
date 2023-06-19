// pages/personal/personal.js
import request from '../../utils/request'
let startY =  0;  // 手指起始的纵坐标
let moveY =  0;  // 手指移动的纵坐标
let moveDistance =  0;  // 手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 手指移动的距离
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [] // 用户的播放记录

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 更新userInfo
      this.setData({
        userInfo: JSON.parse(userInfo)
      });

      // 获取用户的播放记录
      this.getUserRecentPlaylist(this.data.userInfo.userId)
    }
    
  },

  // 获取用户播放记录的功能函数
 async getUserRecentPlaylist(userId){
    let recentPlayListData = await request('/user/record',{uid: userId , type:0});
    // 给最近播放歌曲整个key值
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    });
  },

  // 点击屏幕事件的函数
  handleTouchStart(event){
    // touches 可以获得多个手指触屏的纵坐标
    // 拿到第一个手指触屏的纵坐标
    startY = event.touches[0].clientY;
    
  },

  // 触屏移动的函数
  handleTouchMove(event){
    this.setData({
      // 取消掉下拉还有的过渡效果
      coverTransition:''
    });
    moveY = event.touches[0].clientY;
    moveDistance = moveY-startY;
    // console.log(moveDistance);

    // 限制移动的距离
    // 不可以往上移动
    if(moveDistance <= 0){
      return;
    }

    // 往下移动不可以超过80
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    // 根据手指的移动动态更新coverTransform的状态值
    this.setData({
      // 有两个注意点：
      // 1、模板字符串用``
      // 2、在模板字符中用变量是${变量名}
      coverTransform:`translateY(${moveDistance}rpx)`
    });
    
  },

  // 抬起手指的函数
  handleTouchEnd(){
    // 让下移的距离回弹
    this.setData({
      coverTransform:`translateY(0)`,
      coverTransition:'transform 1s linear'
    });
  },

  // 跳转至登录login亚眠的回调
  toLogin(){
    wx.navigateTo({
      // 跳转不成功一般是路径没写对
      url: '/pages/login/login'
    })
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