//index.js
//获取应用实例
const app = getApp()
import {
  utilhttp
} from "../../../utils/util.js";
const util = new utilhttp();
import {
  config
} from "../../../utils/config.js";
Page({
  data: {
    sendranges: ["本校", "世界"],
    index: 0,
    sendrange: "ourschool",
    topdata: app.globalData.topdata,
    swiperdata: config.swiper,
    defaultlabel: config.labels,
    nowlabel: "全部",
    message_school: [],
    message_world: [],
    labelindex: 0,
    msgindex: 0,
    hiddeninput: true,
    inputmove: 0,
    viewmove: 0,
    animation: {},
    animationscroll: [],
    autofocus: false,
    nowtop: 0,
    comment: "",
    textinput: "",
  },
  //事件处理函数

  onLoad: function () {
    var that = this

    var message_world = []
    var message_school = []

    //  设置标签
    var sendrange = that.data.sendrange
    if (app.globalData.person.school == null) {
      sendrange = "world"
      that.setData({
        sendrange: "world",
        index: 1
      })
    }
    var defaultlabel = [{
        content: "全部"
      },
      {
        content: "推荐"
      }
    ]
    var labels = that.data.defaultlabel
    var i = 0
    var label

    for (; i < labels.length; i++) {
      label = {
        content: labels[i].content
      }
      defaultlabel.push(label)
    }

    that.setData({
      defaultlabel: defaultlabel
    })
    // 初始化请求动态消息
    that.getMsg(1, 2)
  },
  getMsg: function (page, size) {
    var that = this
    var schoolCode = app.globalData.person.school.schoolCode
    var message = []
    if (that.data.sendrange == "world")
      schoolCode = "0"
    Promise.all([util.getMessage(schoolCode + "&" + that.data.nowlabel + "&" + page + "&" + size)]).then(res => {
      var messages = res[0]
     
      var i = 0
      var msgs
      for (; i < messages.length; i++) {
        var detail = null
        var hidden = false
        if (messages[i].messageContent != null)
          if (messages[i].messageContent.detail.length > 100) {
            hidden = true
            messages[i].messageContent.detail.substring(0, 100)
            detail = messages[i].messageContent.detail.substring(0, 100)
          }
        msgs = {
          num: 0,
          width: 0,
          hiddentext: hidden,
          detail: detail,
          hiddeninput: true,
          comment: "",
          msg: messages[i]
        }
        detail = null
        message.push(msgs)
      }
      i = 0
      var length = 0
      for (; i < message.length; i++) {

        length = message[i].msg.filelist.length
        if (length == 1)
          length = 1
        else if (length == 0)
          length = 0
        else if (length == 2 || length == 4)
          length = 2
        else length = 3
        message[i].num = length
      }
    }).then(res => {

      var i = that.data.labelindex
      var msg = []
      if (that.data.sendrange == "world")
        msg = that.data.message_world
      else msg = that.data.message_school

      var length = 0
      if (i < msg.length) {
        length = msg[i].content.length
        message = msg[i].content.concat(message)
        msg[i].content = message
      } else {
        var msgs = {
          label: that.data.nowlabel,
          content: message,
          bottom:0,
          page:0
        }
        msg.push(msgs)
      }
      if (length == 2)
        length = 0
        
      msg[i].page= msg[i].content.length/4
      if(msg[i].content.length%4!=0&&msg[i].content.length!=2)
        msg[i].bottom=1
      if (that.data.sendrange == "world")
        that.setData({
          message_world: msg,
        })
      else that.setData({
        message_school: msg,
      })

      if (message.length == 2)
        that.getMsg(2, 2);
      else this.definewidth(length)

      //   }
      // })

    })
  },

  definewidth: function (length) {
    var that = this
    var messages
    that.data.sendrange == "world" ? messages = that.data.message_world : messages = that.data.message_school
    var message = []
    message = messages[that.data.labelindex].content
    var j = length
    var a = [0, 0, 0, 0, 0]

    var wid = wx.getSystemInfoSync().windowWidth
    for (; j < message.length; j++) {

      if (message[j].msg.filelist.length == 1) {
        a[j - length] = 1
        wx.getImageInfo({
          src: message[j].msg.filelist[0].url,
          success: function (res) {
            var b = 0
            for (; b + length < a.length; b++)
              if (a[b + length] == 1) {
                a[b + length] = 0
                break
              }
            b = b + length
            if (res.width < res.height)
              message[b].width = 350
            else if (wid > res.width)
              message[b].width = res.width * 750 / wid
            else message[b].width = 700
            messages[that.data.labelindex].content = message
            that.data.sendrange == "world" ? that.setData({
              message_world: messages
            }) : that.setData({
              message_school: messages
            })

          }
        })
      }

    }
  },
  showcommentinput: function (e) {
    console.log(e)
    var that = this
    var messages
    var labelindex = 0
    var msgindex = 0
    var msgId = ""
    var hiddeninput = that.data.hiddeninput
    var message = e.currentTarget.dataset.message
    if (message.comment != null) {
      msgId = message.comment.msgId
      that.setData({
        comment: message
      })
    } else {
      msgId = message.msgId
      that.setData({
        comment:null
      })
    }

    if (that.data.sendrange == "world")
      messages = that.data.message_world
    else messages = that.data.message_school
    var i = 0
    var j = 0
    for (; i < messages.length; i++) {

      if (messages[i].label == that.data.nowlabel) {
        for (j = 0; j < messages[i].content.length; j++) {
          if (messages[i].content[j].msg.message.msgId = msgId) {
            labelindex = i
            msgindex = j
            if (that.data.hiddeninput == true)
              wx.createSelectorQuery().select('#' + msgId).boundingClientRect(function (res) {
                that.setData({
                  msgindex: msgindex,
                  labelindex: labelindex,
                  hiddeninput: false,
                  autofocus: true,
                  nowtop: res.top
                })
              }).exec();

            return

          }
        }
        break
      }

    }

  },
  textchange: function (e) { //文字超过100的展开和收起
    var that = this
    var message = []
    var i = 0
    if (that.data.sendrange == "world")
      for (; i < that.data.message_world.length; i++)
        if (that.data.message_world[i].label == that.data.nowlabel) {
          message = that.data.message_world
          var j = 0
          for (; j < message[i].content.length; j++)
            if (message[i].content[j].msg.message.msgId == e.target.dataset.index) {
              if (message[i].content[j].hiddentext == false)
                message[i].content[j].hiddentext = true
              else message[i].content[j].hiddentext = false
              break
            }
          that.setData({
            message_world: message
          })

        }
    if (that.data.sendrange == "ourschool")
      for (; i < that.data.message_school.length; i++)
        if (that.data.message_school[i].label == that.data.nowlabel) {
          message = that.data.message_school
          var j = 0
          for (; j < message[i].content.length; j++)
            if (message[i].content[j].msg.message.msgId == e.target.dataset.index) {
              if (message[i].content[j].hiddentext == false)
                message[i].content[j].hiddentext = true
              else message[i].content[j].hiddentext = false
              break
            }
          that.setData({
            message_school: message
          })

        }
  },

  rangeChange: function (e) {
    var result = "ourschool"
    if (e.detail.value == 1)
      result = "world"
    this.setData({
      sendrange: result,
      index: e.detail.value,
      labelindex: 0
    })

  },
  labelcheck: function (e) {

    var that = this
    var nowlabel = e.target.dataset.label
    var messages
    that.data.sendrange == "world" ? messages = that.data.message_world : messages = that.data.message_school
    var i = 0
    for (; i < messages.length; i++)
      if (messages[i].label == nowlabel)
        break
    that.setData({
      nowlabel: nowlabel,
      labelindex: i
    })
    if (i == messages.length)
      that.getMsg(1, 2);
  },
  keyBoardChange(height) {
    //键盘高度改变时调用
    var that = this

    var len = -height + app.globalData.tabBarHeight / 2
    var top = that.data.nowtop
    var viewmove = (app.globalData.screentHeight + len) - top

    that.setData({
      inputmove: -len,
      viewmove: viewmove
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
    var animationscroll = wx.createAnimation({
      duration: 1,
      timingFunction: 'linear'
    })
    animationscroll.translate(0, this.data.viewmove).step({
      duration: 100
    })
    this.setData({
      animation: animation.export(),
      animationscroll: animationscroll.export()
    })
  },
  textareachange: function (e) {
    this.keyBoardChange(e.detail.height)
  },

  closeinput: function (e) {

    var that = this
    var messages
    that.data.sendrange == "world" ? messages = that.data.message_world : messages = that.data.message_school
    messages[that.data.labelindex].content[that.data.msgindex].comment = e.detail.value

    that.setData({
      hiddeninput: true,
      inputmove: 0,
      viewmove: 0,
      textinput: e.detail.value
    })
    that.data.sendrange == "world" ? that.setData({
      message_world: messages
    }) : that.setData({
      message_school: messages
    })

    that.move()

  },
  sendcomment: function () {
    var that = this
    var comment = that.data.comment
    var messages

    that.data.sendrange == "world" ? messages = that.data.message_world : messages = that.data.message_school
    var replycommentId = "0"
    var atId = null
    if (comment != null) {
      comment=comment.comment
      if (comment.replycommentId != "0")
        replycommentId = comment.replycommentId
      else replycommentId = comment.commentId
      atId = comment.uid
    }



    var sendcomment = {
      msgId: messages[that.data.labelindex].content[that.data.msgindex].msg.message.msgId,
      uid: app.globalData.person.user.uid,
      replycommentId: replycommentId,
      atId: atId,
      content: that.data.textinput,
      timeSend: new Date()
    }
    Promise.all([util.sendcomment(sendcomment)]).then(res => {
      var comments = messages[that.data.labelindex].content[that.data.msgindex].msg.finalComments
      var comment = that.data.comment
      if (comment != null) {
        comment=comment.comment
        var i = 0
        for (; i < comments.length; i++)
          if (comments[i].comment.commentId == comment.commentId)
            break;
        comments[i].numberComment++
        messages[that.data.labelindex].content[that.data.msgindex].msg.finalComments = comments
      }
      messages[that.data.labelindex].content[that.data.msgindex].msg.message.numberComment++
      that.data.sendrange == "world" ? that.setData({
        message_world: messages,
        comment:null
      }) : that.setData({
        message_school: messages,
        comment:null
      })
      wx.showToast({
        title: '评论成功',
      })
    })

  },
  todetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../messagedetail/messagedetail?message=' + JSON.stringify(e.currentTarget.dataset.msg),
    })
  },
  onReady: function () {


  },  
  onReachBottom: function () {
   var that=this
   var messages
  that.data.sendrange == "world" ? messages = that.data.message_world : messages = that.data.message_school
if(messages[that.data.labelindex].bottom!=1)
   that.getMsg(messages[that.data.labelindex].page+1,4)
  },

})