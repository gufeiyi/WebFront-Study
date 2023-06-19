// pages/search/search.js
import request from '../../utils/request'
// let isSend = false; // 函数节流使用
// let sendTime = null; // 函数的定时器标识
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder默认内容
    hostList: [], // 热搜榜的数据
    searchContent: '', // 用户初始化表单项的数据
    searchList: [], //关键字模糊匹配的数据
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();

    // 获取历史记录
    this.getStorageData();
  },
  // 获取初始化的数据
  async getInitData() {
    let placeholderContentData = await request('/search/default')
    let hostListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderContentData.data.showKeyword,
      hostList: hostListData.data,
    });
  },

  // 获取本地历史记录的函数
  getStorageData() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 表单项内容发生改变内容的回调
  handleInputChange(event) {
    // 更新searchContent的状态数据
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 函数防抖
    /* if (sendTime) {
      clearTimeout(sendTime);
    } */
    // 函数节流
    /* if (isSend) {
      return
    }
    isSend = true; */
    /* 
      谈谈我的理解,在定时装置里面的函数,3s执行一次,
      在表单项回调里面的函数,只要表单项改变,函数就会执行
      因此,在搜索框里不停的搜索内容3s只有1个false和无数个true,
      所有的true只是更改了searchContent的内容就出去了,
      而只有那一个false进入到定时器中,调用了定时装置里面的请求数据的函数,进行了访问数据
    */

    /* 
     这个方法函数节流的思想是好的,但是写的不够完善,最大的缺点就是,在这300ms,
     我们无法确保我们写最后结果的时候,是不是isSend为false,会导致最后结果不请求数据就退出了函数
    */

    /* 
     关于节流和防抖的理解
     1  节流就是想要减少用户对后端和服务器的访问次数
     2  防抖就是因为用了定时器造成了产生了很多开着的定时器,
        定时器里面的数据不停的反复执行,参见小方块越点走的越快,
        因此最好每开启一个定时器,咱就关一个
    */
    // 获取搜索数据
    this.getSearchList();
    /* sendTime = setTimeout(() => {
      isSend = false;
    },300) */
  },

  // 获取搜索数据的功能函数
  async getSearchList() {
    // 如果表单项内容为空的时候不发请求
    // 这个功能不是不起作用,而是不能删的太快,删的太快searchList里面的东西删不了
    if (!this.data.searchContent) {
      this.setData({
        searchList: [],
      });
      return;
    }
    let { searchContent, historyList } = this.data;
    // 发请求获取关键字的模糊匹配数据
    let searchListData = await request('/search', { keywords: this.data.searchContent, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
    });

    // 将搜索到的关键字添加到搜索的历史记录中
    // 如果列表中有重复的,把重复的删掉
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    // 在最前面加上搜索内容
    historyList.unshift(searchContent);
    this.setData({
      historyList
    });

    // 同时把搜索记录存到本地
    wx.setStorageSync('searchHistory', historyList)
  },

  // 点击❌的回调清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: [],
    })
  },

  // 点击删除的回调清空所有的搜索记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除吗?',
      success: ((res) => {
        if (res.confirm) {
          // 清空data中historyList
          this.setData({
            historyList: []
          });
          // 移除本地的历史记录
          wx.removeStorageSync('searchHistory');
        }
      }),
    });
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