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
Page({

  data: {
    index: 0,
    // 滑动到的位置
    swiperIndex: 0,
    // 此值控制swiper的位置
    swiperCurrent: 0,
    // 值为0禁止切换动画
    swiperDuration: "250",
    // 当前swiper渲染的items
    swiperList: [],
    // 需要几个swiperItem, 最少值为3,如果有分页的需求，可以是10、20, 任何
    swiperListLength: 3,

    list:[],
    rightMap:{

    },
    me: [],
    errorids:[],
    starids:[],
    startShowStatus:[],
    typeArr:[],
    StorageAll:{},
    orderPX:{},
    redNum: 0,
    greenNum: 0,
    allNum: 0,
    iconInd: !1,
    iconIndtwo: !1,
    indexInd: 0,
    current: 0,
    textTab: "答题模式",
    selectInd: !0,
    testMode: !1,
    everyDay_all: 0,
    circular: !0,
    interval: 1000,
    moreArr: {
      A: !1,
      B: !1,
      C: !1,
      D: !1,
      E: !1,
      F: !1
    },
    everyDay_error: 0,
    everyDay_all: 0,
    mode: "1",
    idarr: [],
    questions: [],
    recmend: !1,
    cateName:"",
    mode:'',
    starshow: !1,
  },

  onLoad: function (options) {

      console.log(options);
      //  根据 sitemap 的规则[0]，当前页面 [pages/moni/moni?mode=undefined&cateid=55] 将被索引
      let cateid = options.cateid;

      wx.getStorage({
        key: "starids"+cateid,
        success: function (res) {
          console.log('收藏信息：')
          console.log(res);
          that.setData({
            starids: res.data
          })
        }
      })

      let _q = 'q_' + cateid;
      let _qid = 'qid_' + cateid;
      question.initQuestions(_q, _qid);
  
      let idArr = question.questionIds["questionId"];
      // let allQues = question.questions["question"];

      let allQues = question.questions["items"];
      let rightMap = question.questions['rightMap'];
      // let idArr = wx.getStorageSync(_qid);
      
      let question_ids = [];
      let questions = [];
      let mode = options.mode;
      let nums = idArr.length;

      
      
      question_ids = a.shuffle(idArr)
      this.newFormatData(question_ids);

      let id = question_ids[0];
      setTimeout(()=>{
        let starshow = false;
        if(that.data.starids.indexOf(id)!=-1){
          starshow = true;
        }
        that.setData({
          starshow
        })
      },1000)

      let that = this;
      this.setData({
        rightMap,
        cateid,
        nums
      },()=>{
        console.log('当前题目信息');
        console.log(app.globalData.questions[0]);
        that.requestQuestionInfo()
      })
      setTimeout(()=>{
        this.setData({
          idArr
        })
      },1000)
      
  },
  requestQuestionInfo: function () {
    let that = this
    // 模拟网络请求成功
    let questionList = app.globalData.questions;
//    [
//      { index: 0 },
//      { index: 1 },
//      { index: 2 },
//      { index: 3 },
//      { index: 4 },
//      { index: 5 },
//      { index: 6 },
//      { index: 7 },
//      { index: 8 },
//      { index: 9 },
//      { index: 10 },
//      { index: 11 },
//      { index: 12 },
//      { index: 13 },
//      { index: 14 },
//      { index: 15 },
//      { index: 16 },
//      { index: 17 },
//      { index: 18 },
//      { index: 19 },
//    ]
    // 上次做题的进度，比如上次做到第三题了
    let lastDoQuestionIndex = 0;

    let current = lastDoQuestionIndex % that.data.swiperListLength
    that.setData({
      list: questionList,
      swiperList: util.getInitSwiperList(questionList, that.data.swiperListLength, lastDoQuestionIndex),
      swiperIndex: current,
      swiperCurrent: current,
    })
    // 暂时全局记一下list, 答题卡页直接用了
    app.globalData.questionList = questionList
  },
  onReady: function () {

  },

  onShow: function () {

  },

  init_play:function(options,question_ids){
    let mode = options.mode;
    wx.setNavigationBarTitle({
      title: '顺序练习',
    });
    this.onQuery(options);

  },
  onQuery:function(options){
    // this.ind_to_data();
  },
  ind_to_data: function () {
    let that = this;

    console.log('初始化');
    console.log(questions);
    console.log(this.data.indexInd);
    console.log(questions[this.data.indexInd]);

    this.formatData(this.data.idArr,this.data.indexInd);
   
  },
  formatData: function(idArr,index){
    console.log('format');
    let allQues = question.questions["items"];
    let that = this;
    let obj = allQues[index];
    let answer = obj.answer;
    let options = obj.options;
    let arr = [];
    let type = obj.type;

    let newOptions = [];
    switch(type){
      case 1:
      case 2:
      case 3:
        Object.keys(options).forEach(key => {
          let val = 0;
          if(answer.indexOf(key) != -1){
            val =1;
          }
          arr.push({
            code: key,
            content: options[key],
            selected: false,
            val: val
          })
        })
        obj.options = arr;
        break
      case 4:
      case 5:
        // 根据答案自己拼接选项
        let aItems = obj.answer.split('|');
        
        aItems.forEach((aItem, idx)=>{
          let newOption = {
            code: idx,
            content: aItem,
            selected: false,
            val: 1
          }
          newOptions.push(newOption)
        })
        obj.options = newOptions;
        break;
      default:
        console.log('未知匹配')
    }
    obj.right = -1;
    return obj;
    let questions = this.data.questions;
    questions[index] = obj;
    console.log('格式化');
    console.log(question);
    questions[index+1] = null;
    this.setData({
      questions 
    })
  },
  newFormatData: function(question_ids){
    console.log('format');
    let allQues = question.questions["question"];
    let newQuestions = [];
    question_ids.map((id,idx)=>{
      let obj = allQues[id];
      obj.index = idx;
      let answer = obj.answer;
      let options = obj.options;
      let arr = [];
      let type = obj.type;
  
      let newOptions = [];
      switch(type){
        case 1:
        case 2:
        case 3:
          Object.keys(options).forEach(key => {
            let val = 0;
            if(answer.indexOf(key) != -1){
              val =1;
            }
            arr.push({
              code: key,
              content: options[key],
              selected: false,
              val: val
            })
          })
          obj.options = arr;
          break
        case 4:
        case 5:
          // 根据答案自己拼接选项
          let aItems = obj.answer.split('|');
          
          aItems.forEach((aItem, idx)=>{
            let newOption = {
              code: idx,
              content: aItem,
              selected: false,
              val: 0
            }
            newOptions.push(newOption)
          })
          obj.options = newOptions;
          break;
        default:
          console.log('未知匹配')
      }
      obj.right = -1;
      newQuestions.push(obj);
    })
    app.globalData.questions= newQuestions;
    console.log('格式化数据完成');
    console.log(newQuestions);
    
  },
  jumpToQuestion: function (e) {
    console.log('jump');
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.id;
    console.log('index');
    console.log(id);
    console.log(this.data.idArr);
    let index = this.data.idArr.indexOf(id+'');
    
          // 进行取余，算出在swiperList的第几位
    let current = index % this.data.swiperListLength
    let currentSwiperListItem = "swiperList[" + current + "]";
    
    this.setData({
      swiperCurrent: current,
      [currentSwiperListItem]: this.data.list[index],
    })

    // 将前后的数据都改了
    this.changeNextItem(current)
    this.changeLastItem(current)

    this.setData({
      index,
      circular: true,
      iconInd: false,
      iconIndtwo: false,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('jump结束');
    });

      return;

    
    if(index>this.data.indexInd){
      this.formatData(this.data.idArr,index);
    }
    

    this.setData({
      circular: false,
      iconInd: false,
      iconIndtwo: false,
      current: index,
      indexInd: index,
      videoctrl: true
    },()=>{
      // this.autoPlay();
      console.log('设置完');
    });
  },
  starcollect:function(){
    let starshow = !this.data.starshow;
    this.setData({
      starshow:starshow
    });
    let startShowStatus = this.data.startShowStatus;
    let starids = this.data.starids;
    let questions = app.globalData.questions;
    let question = questions[this.data.index];
    startShowStatus[this.data.index] = starshow;
    starids.push(question.id)
    this.setData({
      startShowStatus,
      starids
    })
    wx.setStorage({
      key: 'starids' + this.data.cateid,
      data: starids
    })

  },
  touchstart: function (t) { },
  bindtouchmove: function (t) { },
  bindtouchend: function (t) { },
  selectAnswer: function (e) {
    console.log('selectAnswer');
    console.log(new Date())
    console.log(app.globalData.questions);
    console.log(e);
    console.log(e.currentTarget.dataset);
    let item = JSON.parse(e.currentTarget.dataset.value);
    let code = e.currentTarget.dataset.code;
    let answer = e.currentTarget.dataset.answer;
    let options = item.options;

    let greenNum = this.data.greenNum;
    let redNum = this.data.redNum;
    let rightMap = this.data.rightMap;
    item.right = 0;
    rightMap[item.id] = 0;
    
    let errorids = this.data.errorids;
    options.map(o => {
      if(o.code == code){
        o.selected = true;
      }
      if((o.code == code)&&(o.code == answer)){
        o.val = 1;
        greenNum++;
        item.right = 1;
        rightMap[item.id] = 1;
      }
      if((o.code == code)&&(o.code != answer)){
        o.val = 0;
        redNum++;
        errorids.push(item.id);
      }
    })
    console.log('item');
    console.log(item);
    item.options = options;
    let questions = app.globalData.questions;
    questions[item.index] = item;
    app.globalData.questions = questions;
    let swiperList = this.data.swiperList;
    console.log(swiperList);

    let newSwiperList = [];
    swiperList.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      console.log(ele)
      newSwiperList.push(ele);
    })
    console.log(newSwiperList);
    console.log(new Date())
    console.log({
      swiperList: newSwiperList,
      rightMap,
      greenNum: greenNum,
      redNum: redNum,
    })
    this.setData({
      swiperList: newSwiperList,
      rightMap,
      greenNum: greenNum,
      redNum: redNum,
      errorids
    },()=>{
      console.log(new Date())
      wx.setStorage({
        key: 'errorids' + this.data.cateid,
        data: errorids
      })
    })
    if(item.right==1 && this.data.indexInd < this.data.nums-1){
      this.autoPlay();
    }
  },
  getObjByIndex: function(index){
    let items = app.globalData.questions;
    let obj;
    // 终止for循环，使用break
    for (let i=0; i < items.length; i++) {
      if (items[i]['index']==index) {
          obj = items[i];
          break;
      }
    }
    return obj;
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

    let questions = app.globalData.questions;
    questions[item.index] = item;

    let swiperList = this.data.swiperList;
    console.log(swiperList);
    let newSwiperList = [];
    swiperList.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      console.log(ele)
      newSwiperList.push(ele);
    })
    console.log(newSwiperList);
    this.setData({
      swiperList: newSwiperList
    });
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


    let me = this.data.me;
    let rightMap = this.data.rightMap;
    item.right = 0;
    
    rightMap[item.id] = 0;
    let errorids = this.data.errorids;
    let type = item.type;
    let answer;
    switch(type){
      case 1:
      case 2:
      case 3:
        answer = item.answer.split('');
        options.forEach(o => {
          if(o.selected){
            nums++;
          }
        })

        item.right = 0;
        if(nums == answer.length){
          item.right = 1;
          rightMap[item.id] = 1;
          greenNum++;
        }else{
          redNum++;
          errorids.push(item.id);
        }
        break;  
      case 4:  
      case 5:
        answer = item.answer.split('|');
        options.forEach(o => {
          if(me.indexOf(o.content) != -1){
            o.selected = 1;
            o.val = 1;
            nums++;
          }
        })

        let meArr = [];
        let j = 0;
        me.forEach((m,idx) => {
          j = idx;
          let val = 0;
          if(answer.indexOf(m) != -1){
            val =1;
          }
          meArr.push({
            code: idx,
            content: m,
            selected: true,
            val: val
          })
        })
        while(meArr.length < options.length){
          j++;
          meArr.push({
            code: j,
            content: '',
            selected: true,
            val: 0
          })
        }
        console.log('格式化后结果')
        console.log(meArr);
        item.meArr = meArr;

        item.right = 0;
        if(nums == answer.length){
          rightMap[item.id] = 1;
          item.right = 1;
          greenNum++;
        }else{
          redNum++;
          errorids.push(item.id);
        }
        break;                      
      default: 
      console.log('其他未涉及题型')
    }
    let questions = app.globalData.questions;
    questions[item.index] = item;

    let swiperList = this.data.swiperList;
    console.log(swiperList);
    let newSwiperList = [];
    swiperList.map((ele) => {
      let index = ele.index;
      console.log('更新：'+index);
      if(index == item.index){
        ele = item;
      }
      console.log(ele)
      newSwiperList.push(ele);
    })
    console.log(newSwiperList);
    this.setData({
      swiperList: newSwiperList,
      rightMap,
      redNum,
      greenNum,
      errorids
    },()=>{
      console.log('多选提交完成')
      wx.setStorage({
        key: 'errorids' + this.data.cateid,
        data: errorids
      })
    })
    console.log('item');
    console.log(item);

    if(item.right == 1 && this.data.indexInd < this.data.nums-1){
      this.autoPlay();
    }
  },
  bindKeyInput: function (e) {
    // console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindBlurInput: function (e) {
    // console.log(e.detail.value);
    let me = this.data.me;
    if(e.detail.value){
      me.push(e.detail.value);
    }
    
    // console.log(me);
    this.setData({
      me,
      inputValue: e.detail.value
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
    this.setData({
        me:[],
        starshow: false,
        autoplay: false
    },()=>{
        this.hanldeSwiperData(e);
    });
    
    return;
    // let current = e.detail.current;
    let current = this.data.current;
    console.log(current);

    let idArr = this.data.idArr;

    let questions = app.globalData.questions;
    
    let newFormatItems = this.data.newFormatItems;
    let indexInd = this.data.indexInd;
    // 向右滑动
    let item;
    if(current<e.detail.current){ 
      console.log('向右滑动');
      indexInd++
      console.log('indexInd=='+indexInd)
      
      item = questions[indexInd+1];
      newFormatItems.push(item);
      newFormatItems.shift();
    }else{
      //向左滑动
      console.log('向左滑动');
      indexInd--
      console.log('indexInd=='+indexInd)
      let item = questions[indexInd-1];
      newFormatItems.unshift(item);
      newFormatItems.pop();
  
    }
    
    this.setData({
      indexInd,
      newFormatItems,
      current: e.detail.current,
      starshow: false
    },()=>{
      console.log(newFormatItems);
    });
    setTimeout(()=>{
      this.setData({
        autoplay: false,
        circular: true
      });
    },1000)
  },
  hanldeSwiperData: function (e) {
    console.log(e)
    var that = this;
    let lastIndex = that.data.swiperIndex
    let current = e.detail.current
    
    let index = that.data.swiperList[current]['index'];
    let obj = app.globalData.questions[index];

    let starshow = true; 
    if(this.data.starids.indexOf(obj.id)==-1){
      starshow = false;
    }
    this.setData({
      starshow,
      index
    })

    // 如果是滑到了左边界，再弹回去
    if (that.data.swiperList[current].isFirstPlaceholder) {
      that.setData({
        swiperCurrent: lastIndex
      })
      wx.showToast({
        title: "已经是第一题了",
        icon:"none"
      })
      return
    }
    // 如果滑到了右边界，弹回去，再弹个对话框
    if (that.data.swiperList[current].isLastPlaceholder) {
      that.setData({
        swiperCurrent: lastIndex,
        // todo 弹个对话框
      })
      wx.showModal({
        title: "提示",
        content: "您已经答完所有题，是否退出？",
      })
      return
    }

    console.log("当前swiper下标是：" + current + "，末尾下标为：" + (that.data.swiperList.length - 1) + "。"
      + "当前list下标是" + that.data.swiperList[current].index + "，末尾下标为：" + (that.data.list.length - 1))

    // 正向滑动，到下一个的时候
    // 是正向衔接
    let isLoopPositive = current == 0 && lastIndex == that.data.swiperList.length - 1
    if (current - lastIndex == 1 || isLoopPositive) {
      that.changeNextItem(current)
    }

    // 反向滑动，到上一个的时候
    // 是反向衔接
    var isLoopNegative = current == that.data.swiperList.length - 1 && lastIndex == 0
    if (lastIndex - current == 1 || isLoopNegative) {
      that.changeLastItem(current)
    }
  
    // 记录滑过来的位置，此值对于下一次滑动的计算很重要
    that.data.swiperIndex = current
  },
  changeNextItem: function (current) {
    let that = this
    let swiperChangeIndex = util.getNextSwiperChangeIndex(current, that.data.swiperList)
    let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
    that.setData({
      [swiperChangeItem]: util.getNextSwiperItem(current, that.data.swiperList, that.data.list)
    })
  },

  changeLastItem: function (current) {
    let that = this
    let swiperChangeIndex = util.getLastSwiperChangeIndex(current, that.data.swiperList)
    let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
    that.setData({
      [swiperChangeItem]: util.getLastSwiperItem(current, that.data.swiperList, that.data.list)
    })
  },

  onClickAnswerCard: function(e) {
    let that = this;
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      swiperDuration: "0"
    })
    // 需要swiperListLength计算点击后的current
    wx.navigateTo({
      url: '../../pages/question_answer_card/question_answer_card?swiperListLength=' + that.data.swiperListLength,
    })
  },

  onClickLast:function(e) {
    let that = this
    let lastIndex = that.data.swiperIndex == 0 ? that.data.swiperListLength - 1 : that.data.swiperIndex - 1
    that.setData({
      swiperCurrent: lastIndex
    })
  },

  onClickNext: function (e) {
    let that = this
    let nextIndex = that.data.swiperIndex == that.data.swiperList.length - 1 ? 0 : that.data.swiperIndex + 1
    that.setData({
      swiperCurrent: nextIndex
    })
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
    "2" != this.data.mode && this.data.everyDay_all >= 5 && (wx.setStorageSync("every_day_play", {
      everyDay_error: this.data.everyDay_error,
      everyDay_all: this.data.everyDay_all
    }), this.setData({
      everyDay_all: 0
    }), this.result(1));
  },
  result:function(t){
    console.log(t)

  }

})