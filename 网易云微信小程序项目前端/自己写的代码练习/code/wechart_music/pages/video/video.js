// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', // 导航的标识
    videoList: [], //视频的列表数据（自己）
    ddtList: [], //视频的列表数据（他人）
    videoId:'', // 点击播放的视频id标识
    videoUpdateTime: [], // 记录video播放的时长
    isTriggered: false, // 标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航标签的数据
    this.getViedoGroupListData();

  },

  // 获取导航数据
  async getViedoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      // 默认第一个显示下边框
      navId: videoGroupListData.data[0].id
    });
    // 获取视频列表数据（自己的方法）
    // this.getVideoList(this.data.navId);
    this.getListDetail(this.data.navId);
  },

  // 获取视频列表别人的方法
  async getListDetail(navId) {
    let videoDetails = await request('/video/group', { id: navId }, 'GET');
    let videoInfoList = [];
    videoDetails.datas.forEach(i => {
      videoInfoList.push({
        id: i.data.vid,
        title: i.data.title,
        creator: i.data.creator,
        commentCount: i.data.commentCount,
        praisedCount: i.data.praisedCount,
        coverUrl: i.data.coverUrl,
        videoUrl: ''
      })
    })
    // 存在异步的问题
    /* videoInfoList.forEach(i => {
      let result = request('/video/url', { id: i.id }).then(r => {

        i.videoUrl = r.urls[0].url
        console.log(i.videoUrl);

      })

    }) */
    for (const i of videoInfoList) {
      let result = await request('/video/url',{id:i.id}).then(r =>{
          i.videoUrl = r.urls[0].url
      })
  }
    this.setData({
      ddtList: videoInfoList
    })
    // 全部获取完视频后，关闭消息提示框
    wx.hideLoading({
      success: (res) => { },
    });

    // 关闭下拉刷新
    this.setData({
      isTriggered:false
    })
  },

  // 获取视频列表数据
  async getVideoList(navId) {
    let videoListData = await request('/video/group', { id: navId })
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList
    })


  },

  // 点击切换导航的回调
  changeNav(event) {
    // 通过id传参，如果传的数据类型是number会自动转换成string
    // 如果用的是data-id，需要在event.currentTarget.dataset.id中寻找数据，并且这个方法不会强制转换数据
    let navId = event.currentTarget.id;
    this.setData({
      navId: navId * 1,
      ddtList:[]
    });
    // 因为视频加载过慢，所以需要显示正在加载
    wx.showLoading({
      title: '正在加载',
    })

    // 动态获取当前导航视频的数据
    this.getListDetail(this.data.navId);
  },

  // 点击播放的回调/继续播放的回调
  // 解决多个视频可以同时播放的问题
  handlePlay(event){
    /* 
      需求：
      1、找到上一个播放的视频
      2、关闭上一个播放的视频

      单例模式：
      1、需要创建多个对象的场景下，通过一个变量（this）接受，始终保持只有一个对象
      2、优点：可以节省空间
    */
   let vid = event.currentTarget.id;
    //  关闭上一个实例对象
    // 确保不是第一次点击，确保两次点击的不是同一个对象
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // 创建这次的vid
    // this.vid = vid;

    // 更新data中的videoId的状态数据
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的下一个实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前的视频之前是否播放过，如果有，跳转指定播放位置
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();

  },

  // 监听视频播放进度的回调
  handleTimeUpdate(event){
    // 创建一个对象存放操作视频对象的id和时长
    let videoTimeobj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    };
    // 让我们对象里的某个变量videoUpdateTime成为data中的videoUpdateTime
    let {videoUpdateTime} = this.data;

    /* 
      思路：
        判断videoUpdateTime有没有当前视频的播放记录
        有 ---->  改原有记录播放时长为当前播放时长
        没有 ---> 需要在数组中添加当前视频的播放对象
    */
    // videoItem 判断一下列表中有没有当前点击的视频id
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeobj.vid);
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime;
    }else{
      videoUpdateTime.push(videoTimeobj);
    }
    this.setData({
      videoUpdateTime
    })
    
  },

  // 视频播放结束的时候调用
  handleEnded(event){
    // 移除记录播放时长数组中当前视频的对象
    let {videoUpdateTime} = this.data;
    // 找到当前视频的index
    let index = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id);
    // 将对应的记录删除
    videoUpdateTime.splice(index,1);
    // 更新一下data中的videoUpdateTime
    this.setData({
      videoUpdateTime
    });
    
  },

  // 自定义下拉刷新的回调
  hanleRefresher(){
    // 发请求获取最新的视频数据
    this.getListDetail(this.data.navId);
    
  },

  // 自定义上拉触底的回调
  handleTolower(){
    // 数据分页 1、后端分页  2、前端分页
    /* 
      发送请求
      在前端获得最新的数据，追加到视频列表的后方
    */
  /* //  获取最新的数据
   let newVideoList = [{},{},{}];
   let ddtList = this.data.ddtList;
  //  把最新的数据放到数组中
   ddtList.push(...newVideoList)
   this.setData({
    ddtList
   }) */
    
  },

  // 跳转至搜索界面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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
    console.log('页面的下拉刷新');
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if (from === 'button') {
      return {
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }else{
      return {
        title: '来自menu的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
    
  }
})