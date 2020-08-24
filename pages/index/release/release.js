// pages/index/release/release.js
const app = getApp()
import {
  config
} from "../../../utils/config.js";

const date = require('../../../utils/time.js')
import {
  utilhttp
} from "../../../utils/util.js";
import {
  uploadto
} from "../../../utils/crypto/cosphoto.js";
const upload = new uploadto();
const util = new utilhttp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    messagetext: "",
    voice: false,
    sendranges: ["本校", "世界"],
    index: 0,
    sendrange: "ourschool",
    defaultlabel: [],
    releaselabel: config.labels,
    labels: [],
    playVideoSrc: "",
    type: 0,
    viedosize: " width: 230rpx;height: 230rpx;",
    schoolCode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var defaultlabel = []
    var labels = that.data.releaselabel
    var i = 0
    var label
    for (; i < labels.length; i++) {
      label = {
        check: 0,
        content: labels[i].content
      }
      defaultlabel.push(label)
    }

    that.setData({
      defaultlabel: defaultlabel,
      releaselabel:defaultlabel,
      schoolCode: app.globalData.person.school.schoolCode
    })
  },
  textinput: function (e) {
    var that = this
    that.setData({
      messagetext: e.detail.value
    })
  },

  rangeChange: function (e) {
    var result = "ourschool"
    var schoolCode=app.globalData.person.school.schoolCode
    if (e.detail.value == 1){
      result = "world"
      schoolCode=0
    }
    this.setData({
      sendrange: result,
      index: e.detail.value,
      schoolCode:schoolCode
    })

  },

  labelbutton: function (e) {
    var that = this
    var label = {
      label: e.target.dataset.label.content
    }

    var labels = that.data.labels
    var defaultlabel = that.data.defaultlabel
    var i = 0
    var j = 0

    for (; i < labels.length; i++) {
      if (labels[i].label == label.label)
        for (j = 0; j < defaultlabel.length; j++) {
          if (defaultlabel[j].content == label.label) {
            defaultlabel[j].check = 0
            labels.splice(i, 1)
            that.setData({
              defaultlabel: defaultlabel
            })
            return
          }
        }
    }
    if (labels.length == 3) {
      wx.showToast({
        title: '标签不能超过3个，再次点击已有标签可取消',
      })
      return
    }
    labels.push(label)
    var k = 0
    for (; k < defaultlabel.length; k++) {
      if (defaultlabel[k].content == label.label) {
        defaultlabel[k].check = 1
        that.setData({
          defaultlabel: defaultlabel
        })
        return
      }
    }


  },
  choose: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ["照片", "视频"],
      itemColor: "#000000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.setData({
              type: 1
            })
            that.choosephoto()
          } else if (res.tapIndex == 1) {

            that.chooseVideo()
          }
        }
      }
    })
  },
  choosephoto: function (e) {
    var that = this;
    var imgs = that.data.image;

    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.image;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            break;
          } else {
            var img = {
              type: "photo",
              url: tempFilePaths[i]
            }
            imgs.push(img);

          }
        }
        that.setData({
          image: imgs
        });

      }
    });
  },
  chooseVideo: function () {
    var that = this;
    wx.chooseVideo({
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePath;
        var imgs = that.data.image;
        // console.log(tempFilePaths + '----');

        if (imgs.length >= 9) {

        } else {
          var img = {
            type: "video",
            url: tempFilePaths
          }
          imgs.push(img);
        }

        that.setData({
          image: imgs
        });


      }
    })
  },



  submit: function () {
    var that = this
    var imgs = that.data.image
    if (app.globalData.person.school == null) {
      wx.showToast({
        title: '请先选择学校',
      })
      return
    }
    if (that.data.labels.length == 0) {
      wx.showToast({
        title: '请选择标签',
      })
      return
    }
    if (imgs.length == 0 && that.data.messagetext == "") {
      wx.showToast({
        title: '请输入消息内容+',
      })
      return
    }
    if (imgs.length > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var i = 0;
      var j = 0;
      for (; i < imgs.length; i++) {
        var a = app.globalData.person.user.uid + timestamp.toString() + i.toString()

        Promise.all([upload.uploadfile(imgs[i].url, a, imgs[i].type)]).then(res => {
          // if (imgs[j].type == "photo")
          //     imgs[j].url = config.http + config.photo + a + ".jpg"
          //   else imgs[j].url = config.http + config.video + a + ".mp4"
          imgs[j].url = res[0].Location
          j++;

          if (j == imgs.length) {
            that.uploadmessage(imgs);
            setTimeout(() => {
              wx.showToast({
                title: '发布成功',
              })
            }, 1000);
          }
        })

      }
    } else that.uploadmessage(null);

  },
  uploadmessage: function (e) {
    var that = this
    var imgs = e
    var text = {
      detail: that.data.messagetext
    }
    var label = that.data.labels
    var message = {
      uidCreate: app.globalData.person.user.uid,
      uidSend: app.globalData.person.user.uid,
      schoolCode: that.data.schoolCode,
      timeSend: new Date()
    }

    var data = {
      message: message,
      messageContent: text,
      labellist: label,
      filelist: imgs
    }
    
    Promise.all([util.addMessage(data)]).then(res => {
      that.setData({
        image: [],
        messagetext: "",
        labels: [],
        defaultlabel: that.data.releaselabel,
      })
    })
  },
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.image;
    wx.previewImage({
      //当前显示图片
      current: imgs[index].tempFilePaths,
      //所有图片
      urls: imgs
    })
  },
  deletefile: function (e) {
    var that = this
    var imgs = that.data.image
    var i = 0
    for (; i < imgs.length; i++) {
      if (imgs[i].url == e.target.dataset.index.url)
        imgs.splice(i, 1)
    }
    that.setData({
      image: imgs
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('prew_video');
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