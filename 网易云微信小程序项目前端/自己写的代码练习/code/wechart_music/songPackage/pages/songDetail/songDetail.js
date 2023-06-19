// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js';
import moment from 'moment';
import request from '../../../utils/request';
// 获取全局的实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay :false, // 音乐播放的状态
    song:{}, // 歌曲的详情对象
    musicId:'', // 音乐的id
    musicLink: '', //音乐的链接
    currentTime:'00:00', // 实时时间
    durationTime:'00:00', // 总时长
    currentWidth: 0, // 实施进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 用来接收路由传递的参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数的长度过长会被自动截取掉
    // console.log(options);
    let musicId = options.musicId;
    this.getMusicInfo(musicId);
    this.setData({
      musicId
    });
    // 判断一下当前页面是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 修改当前页面的音乐状态
      this.setData({
        isPlay :true
      })
    }

    /* 
      问题：用户按系统的控制音乐播放/暂停的按钮，页面不知道，导致页面和音频的播放状态不一致
      解决方案：
      1、控制音频的实例去监视音乐的播放/暂停
    */
      this.backgroundAudioManager = wx.getBackgroundAudioManager();
      // 监视音乐的播放和暂停/停止
      this.backgroundAudioManager.onPlay(() => {
        // 修改音乐播放的状态
        this.changePlayState(true);
        appInstance.globalData.musicId = musicId;
        
      });
      this.backgroundAudioManager.onPause(() => {
        // 修改音乐播放的状态
        this.changePlayState(false);
      });
      this.backgroundAudioManager.onStop(() => {
        // 修改音乐播放的状态
        this.changePlayState(false);
      });

      // 监听音乐实时播放结束
      this.backgroundAudioManager.onEnded(() => {
        // 自动切换到下一首音乐,自动播放下一首歌
        this.switchSong("next");
        // 实时播放长度还原成0
        this.setData({
          currentWidth: 0,
          currentTime: '00:00'
        })
      });
      
      // 监听音乐实时播放的进度
      this.backgroundAudioManager.onTimeUpdate(() => {
        // 格式化实时播放的时间
        let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
        let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration *450;
        this.setData({
          currentTime,
          currentWidth
        });
      })
    
    
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay){
    // 修改音乐播放的状态
    this.setData({
      isPlay
    });
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids: musicId})
    //给durationTime赋值
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    });

    // 动态修改窗口的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 点击播放或者暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // 修改是否播放的状态
    /* this.setData({
      isPlay
    }); */
    let {musicId,musicLink} = this.data;
    this.musicControl(isPlay,musicId,musicLink);
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
   
    if (isPlay) {
      // 播放音乐
      if (!musicLink) {
          // 获取音乐的播放链接
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        });
      }
      
      // 创建控制音乐播放的回调
      
      this.backgroundAudioManager.src = musicLink;
      // 歌曲的名称也是必填项
      this.backgroundAudioManager.title = this.data.song.name;
    }else{
      //停止音乐
      this.backgroundAudioManager.pause();
    }
  },

  // 切换歌曲的功能函数
  switchSong(type){
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // 订阅来自recommendSong页面发布的musicId的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // console.log(msg,musicId);

      // 获取音乐的详情
      this.getMusicInfo(musicId);
      // 自动的播放当前的页面
      this.musicControl(true,musicId);

      PubSub.unsubscribe('musicId');
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType',type)
  },

  // 点击切换的回调
  handleSwitch(event){
    let type = event.currentTarget.id;
    this.switchSong(type);
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