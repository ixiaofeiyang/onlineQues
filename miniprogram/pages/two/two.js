// pages/moni/moni.js
var r = "",
    a = require("../../utils/underscore-min.js"),
    question = require('../../utils/question.js'),
    s = 1,
    d = [],
    n = "",
    i = [];
    let app = getApp();    
var util = require('../../utils/util.js');
let md5 = require('../../utils/md5.js').md5
Page({

  data: {

    index: 0,
    list:[],
    me: [],
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    iconInd: !1,
    iconIndtwo: !1,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    circular: false,
    interval: 1000,
    mode: "1",
    idarr: [],
    questions: [],
    recmend: !1,
    mode:''
  },

  onLoad: function (options) {
      let that = this;
      console.log(options);
      this.onQuery();
      this.onGetOpenid();
      let ordernum = this.generate();
      this.setData({
        ordernum
      })

  },
  generate: function(){
    return util.formatTime(new Date());
  },
  onQuery: function(){
    console.log('开始查询题库');
    let that = this;
    const db = wx.cloud.database();

    db.collection('question')
    .aggregate()
    .match({
      typecode: '02'
    })
    .sample({
      size: 10
    })
    .end()
    .then(res => {
      console.log('[数据库] [查询记录] 成功: ', res)
      let items = res.list;
      let arr = [];
      let questions = [];
      items.map((item,idx)=>{
        console.log(idx);
        console.log(item);
        arr.push(item._id);
        
        let options = item.options;
        options.forEach((o)=>{
          o.selected = false;
        })
        item.index = idx;
        item.status = false;
        item.options = options;
        questions.push(item);
      })
      that.setData({
        questions,
        arr: arr,
        md5: md5(arr.join()),
        nums: arr.length
      },()=>{
        console.log('已赋值完成')
      })
      
    })

  },
  onReady: function () {

  },

  onShow: function () {

  },

  

  jumpToQuestion: function (e) {
    console.log('jump');
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    console.log('index');
    console.log(id);
    console.log(this.data.idArr);
    let index = this.data.idArr.indexOf(id+'');
    
    this.setData({
      circular: false,
      iconInd: false,
      iconIndtwo: false,
      current: index,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('设置完');
    });
  },
 
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  selectAnswer: function (e) {
    console.log('selectAnswer');
    console.log(new Date())
    console.log(this.data.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    item.status = true;
    
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.value == 1)){
        o.val = 1;
        greenNum++;
      }
      if((o.code == code)&&(o.value == 0)){
        o.val = 0;
        redNum++;
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    let questions = this.data.questions;
    questions[item.index] = item;


    console.log(new Date())
    console.log({
      questions,
      greenNum: greenNum,
      redNum: redNum,
    })
    this.setData({
      questions,
      greenNum: greenNum,
      redNum: redNum,
    },()=>{
      console.log(new Date());
      console.log('单选逻辑处理完成')

    })
    if(item.right == 1 && this.data.indexInd < this.data.nums-1){
      this.autoPlay();
    }
  },
  selectAnswerMore: function (t) {
    console.log('多选选第二个选项')
    console.log('selectAnswerMore');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let code = t.currentTarget.dataset.code;
    let answer = t.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    options.map(o => {
      if(o.code == code){
        o.selected = !o.selected;
      }
    })
    console.log(options);
    console.log(item);
    item.options = options;

    let questions = this.data.questions;
    questions[item.index] = item;
    this.setData({
      questions
    })
  },
  newMoreSelectSub: function(t){
    setTimeout(()=>{
      this.moreSelectSub(t);
    },1000)
  },
  moreSelectSub: function (t) {
    console.log('多选');
    console.log('moreSelectSub');
    console.log(t);
    console.log(t.currentTarget.dataset);
    let item = JSON.parse(t.currentTarget.dataset.value);
    let options = item.options;

    let nums = 0;

    let redNum = this.data.redNum;
    let greenNum = this.data.greenNum;

    item.status = 1;
    
    let typecode = item.typecode;
    switch(typecode){
      case '01':
      case '02':
        let arr1 = [];
        let arr2 = [];
        options.forEach(o => {
          if(o.value=='1'){
            arr1.push(o.code)
          }
          if(o.selected){
            arr2.push(o.code);
          }
        })
        if(arr1.join() == arr2.join()){
          greenNum++;
          this.updateProfile(1,1);
        }else{
          redNum++;
          this.updateProfile(0,1);
          this.addNote();
        }

        break;                      
      default: 
      console.log('其他未涉及题型')
    }
    let questions = this.data.questions;
    questions[item.index] = item;

    this.setData({
      questions,
      redNum,
      greenNum
    },()=>{
      console.log('多选提交完成')
    })
    console.log('item');
    console.log(item);

    if(item.status == 1 &&  this.data.index < this.data.nums-1){
      this.autoPlay();
    }
  },
  updateProfile: function(nums,total){
    let that = this;

    const db = wx.cloud.database()

    let openid = this.data.openid;
    const _ = db.command
    db.collection('profiles').doc(openid).update({
      data: {
        // 表示指示数据库将字段自增 10
        nums2: _.inc(nums),
        total2: _.inc(total)
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  autoPlay: function () {
    console.log('autoplay');

      this.setData({
        autoplay: true
      });
  },
  pageChange: function (e) {
    console.log('pageChange');
    console.log(e.detail);
    console.log('current==>'+e.detail.current);
    console.log('index====>'+this.data.index);

   
    
    this.setData({
      index: e.detail.current,
      current: e.detail.current,
      autoplay: false,
      circular: false
    },()=>{
      console.log('滑动完成，继续下一题')
    });
  },

  _updown: function () {
    console.log(this.data.iconInd);
    this.setData({
      iconInd: !this.data.iconInd,
      iconIndtwo: !this.data.iconIndtwo,
    });
  },
  changeTab: function (t) {
    let questions = this.data.questions;
    this.setData({
      questions: questions,
      textTab: t.currentTarget.dataset.texttab,
      selectInd: "答题模式" == t.currentTarget.dataset.texttab
    })
  },
  del_data:function(){
    var t = this;
    wx.showModal({
      content: '确定要清空吗？',
      success:function(a){
        if(a.confirm){
          wx.switchTab({
            url: "../index/index"
          })
        }
      }
    })
  },
  onUnload: function() {

  },
  result:function(t){
    console.log(t)

  },
  goHome: function(){
    wx.navigateBack({
      delta: 1
    })
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
        that.setData({
          openid: openid
        })
       
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  addNote: function(options){
    let that = this;
    let ordernum = this.data.ordernum;
    let questions = this.data.questions;
    let index = this.data.index;
    const db = wx.cloud.database()
    db.collection('notes').add({
      data: {
        ordernum: ordernum,
        question: questions[index]
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        // wx.showToast({
        //   title: '新增记录成功',
        // })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }

})