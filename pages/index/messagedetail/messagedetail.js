// pages/index/messagedetail/messagedetail.js
const app = getApp()
import {
  utilhttp
} from "../../../utils/util.js";
const util = new utilhttp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finalmessage: {},
    comments:[],
    hiddeninput:true,
    inputmove:0,
    animation:{},
    autofocus:false,
    comment:"",
    textinput:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(JSON.parse(options.message))
    that.setData({
      finalmessage: JSON.parse(options.message)
    })
    that.getcomment()
  },
  getcomment:function(){
    var that=this
    Promise.all([util.getcomment(that.data.finalmessage.msg.message.msgId,1,"msgId")]).then(res => {
      that.setData({
        comments:res[0]
      })
    console.log(res[0])
    })

  },
  textchange: function (e) { //文字超过100的展开和收起
    var that = this
    var finalmessage = that.data.finalmessage
    if (finalmessage.hiddentext == false)
      finalmessage.hiddentext = true
    else finalmessage.hiddentext = false
 
    that.setData({
     finalmessage: finalmessage
    })
  },
  keyBoardChange(height) {
    //键盘高度改变时调用
    var that = this
    var len = -height + app.globalData.tabBarHeight / 2
    that.setData({
      inputmove: -len,
    })
    that.move()
  },
  move: function () {
    var animation = wx.createAnimation({
      duration: 1,
      timingFunction: 'ease',
      // transformOrigin: "50% 50%",
    })
    animation.translate(0, this.data.inputmove).step({
      duration: 100
    })
   
    this.setData({
      animation: animation.export()
    })
  },
  textareachange: function (e) {
    this.keyBoardChange(e.detail.height)
  },
  closeinput: function (e) {
    var that = this
    that.setData({
      inputmove: 0,
      textinput: e.detail.value,
      comment:null
    })
   

    that.move()

  },

  sendcomment: function () {
    var that = this
    var comment = that.data.comment
    var finalmessage=that.data.finalmessage
    var replycommentId = "0"
    var atId = null
    if (comment != null) {
      comment=comment.comment
      if (comment.replycommentId != "0")
        replycommentId = comment.replycommentId
      else replycommentId = comment.commentId
      atId = comment.uid
    }
    var sendcomment = [{
      msgId: finalmessage.msg.message.msgId,
      uid: app.globalData.person.user.uid,
      replycommentId: replycommentId,
      atId: atId,
      numberLove:0,
      numberComment:0,
      content: that.data.textinput,
      timeSend: new Date()
    }]
    Promise.all([util.sendcomment(sendcomment[0])]).then(res => {
      var comments = that.data.comments
      var comment = that.data.comment
      if (comment != null) {
        comment=comment.comment
        var i = 0
        for (; i < comments.length; i++)
          if (comments[i].comment.commentId == comment.commentId)
            break;
        comments[i].numberComment++
        comments[i].finalComments=sendcomment.concat(  comments[i].finalComments)
      }
     finalmessage.msg.message.numberComment++
     that.setData({
      finalmessage: finalmessage,
      comments:comments,
      comment:null
      })
      wx.showToast({
        title: '评论成功',
      })
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