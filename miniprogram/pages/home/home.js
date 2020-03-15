// miniprogram/pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate1: 0,
    rate2: 0,
    highScore: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
  },
  onGetOpenid: function() {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        let openid = res.result.openid;
        app.globalData.openid = res.result.openid;
        this.getQueryProfile(openid);
        this.queryHigh(openid);
       
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  getQueryProfile: function(openid){
    let that = this;
    const db = wx.cloud.database();

    db.collection('profiles')
    .doc(openid)
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let profile = res.data;
      let rate1 = parseFloat(profile.nums1/profile.total1)*100;
      let rate2 = parseFloat(profile.nums2/profile.total2)*100;
      that.setData({
        rate1: +rate1.toFixed(2),
        rate2: +rate2.toFixed(2),
        profile: res.data
      },()=>{
        console.log('已赋值完成')
      })
      
    })
    .catch((err)=>{
      console.log(err)
      that.setData({
        rate1: 0,
        rate2: 0
      })
    })
  },
  queryHigh: function(openid){
    let that = this;
    const db = wx.cloud.database()
    db.collection('historys').where({
      _openid: openid
    })
    .orderBy('nums', 'desc')
    .get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res);
        let items = res.data;
        if(items.length>0){
          that.setData({
            highScore: items[0]['nums']
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
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
    this.onGetOpenid();
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

  },
  goOne: function(){
    let url = '/pages/one/one';
    wx.navigateTo({
      url: url
    })
  },
  goTwo: function(){
    let url = '/pages/two/two';
    wx.navigateTo({
      url: url
    })
  },
  goThree: function(){
    let url = '/pages/examhome/examhome';
    wx.navigateTo({
      url: url
    })
  },
  goFour: function(){
    let url = '/pages/challenge/challenge';
    wx.navigateTo({
      url: url
    })
  },
  goFive: function(){
    let url = '/pages/five/five';
    wx.navigateTo({
      url: url
    })
  },
  goSix: function(){
    let url = '/pages/six/six';
    wx.navigateTo({
      url: url
    })
  },
  goHistory: function(){
    let url = '/pages/history/history';
    wx.navigateTo({
      url: url
    })
  },
  go: function(){
    wx.showToast({
      icon: 'none',
      title: '待定功能'
    })
  }         
})