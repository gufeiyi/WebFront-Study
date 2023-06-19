// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图数据
    recommendlist:[], //推荐歌单的数据
    topList:[], //排行榜数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /* wx.request({
      url: 'http://localhost:3000/banner',
      data:{type: 2},
      success: (res) => {
        console.log("成功",res);
      },
      fail: (err) => {
        console.log("失败",err);
      }
    }) */

    // 接收数据异步
    // 获取轮播图数据
    let bannerListData = await request('/banner',{type:2});
    // console.log('数据结果',result);
    // 更新data中的数据
    this.setData({
      bannerList :bannerListData.banners,
    });
    // 获取歌单数据
    let recommendlistData = await request('/personalized', {limit:10})
    this.setData({
      recommendlist :recommendlistData.result,
    });

    // 获取排行榜的数据
    /* 
      需求：发送五次请求，idx为0-4
    */
   let index = 5007;
   let resultArr = [];
   while(index <5010){
    let topListData = await request('/playlist/detail', {id: index++});
    // splice:会修改原数组
    // slice：不会修改原数组
    let topListItem = {
      name:topListData.playlist.name,
      tracks:topListData.playlist.tracks.slice(0,3)
    }
      resultArr.push(topListItem);
      // 不需要等待五次请求都结束才更新，用户体验较好，但是渲染的次数多一些
      this.setData({
        topList: resultArr
      })
   };

  //  更新topList的状态值,放在此处更新，用户的屏幕长时间白屏
  /* this.setData({
    topList: resultArr
  }) */
   
  },

  // 跳转至recommendSong页面的回调
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
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