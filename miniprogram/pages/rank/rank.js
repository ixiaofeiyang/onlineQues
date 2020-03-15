var app = getApp();
Page({

  data: {
    cateid:'',
    moreData:true,
    markShow: !1,
    page:1,
    limit:50,
    rankList:[],
  },

  onLoad: function (options) {
    this.onQuery();
  },
  onQuery: function(){
    console.log('开始查询历史');
    let that = this;
    const db = wx.cloud.database();

    db.collection('historys')
    .orderBy('nums', 'desc')
    .get()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.data;
      
      that.setData({
        rankList: items
      },()=>{
        console.log('已赋值完成')
      })
    })
  },
  onReady: function () {

  },

  onShow: function () {
    
  },

  goBack: function () {
    wx.navigateBack({

    })
  },

  getRankList(params){
    var t = this;
    wx.showLoading({
      'title': '加载中'
    });
    
    wx.request({
      url: app.globalData.url + '/routine/auth_api/get_rank_list',
      method: 'get',
      dataType: 'json',
      data:params,
      success: function (res) {
        t.setData({
          rankList:res.data.data
        });
        wx.hideLoading();
      }
    })
  },
  
  onShareAppMessage: function () {
    return {
      title: "开来看看我的答题成绩吧！",
      path: "pages/start/start",
      imageUrl: "http://file.xiaomutong.com.cn/9353ef0240fb00bc800956b373ee92e5.png"
    }
  },

  go_show_mark: function () {
    this.setData({
      markShow: !this.data.markShow
    });

  },

  onMyEvent: function (t) {
    console.log(this.data.saveImgUrl)
    1 == t.detail.code && this.go_show_mark(), 2 == t.detail.code && (wx.showLoading({
      title: "图片生成中"
    }), this.go_show_mark(), a.handelShowShareImg(this, this.data.saveImgUrl));
  },
})