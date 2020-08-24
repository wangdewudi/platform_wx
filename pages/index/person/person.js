//index.js
//获取应用实例
const app = getApp()
import {
  utilhttp
} from "../../../utils/util.js";
const util = new utilhttp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: null,
    person: null
  },


  onLoad: function () {
    var that = this
    var person = app.globalData.person
    if (person.user != null) {
      that.setData({
        hasUserInfo: true,
        person: person
      })
     return 
    } else if (app.globalData.person.user) {
      this.setData({
        hasUserInfo: true
      })
      that.getuserinform(app.globalData.openid)

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.getuserinform(app.globalData.openid)
        that.setData({
          userInfo: res.userInfo,
         
        })
        

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
         
          that.setData({
            userInfo: res.userInfo,
            
          })
          that.getuserinform(app.globalData.openid)
        }
      })
    }

  },
  getUserInfo: function (e) {
    var that = this
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    that.getuserinform(app.globalData.openid)
  },
  getuserinform: function (e) {
    var that = this
    Promise.all([util.getResuseropenid(e)]).then(res => {
      if (res != "") {
        that.setData({
          person: res[0],
          hasUserInfo: true
        })
        wx.setStorageSync('person', res[0])
        app.globalData.person=res[0]
      } else {
        var data={
            nickname:that.data.userInfo.nickName,
            sex:that.data.userInfo.gender,
            headurl:that.data.userInfo.avatarUrl,
            openid:app.globalData.openid
         }
        Promise.all([util.addUser(data)]).then(res => {
          Promise.all([util.getResuseropenid(app.globalData.openid)]).then(res=>{
            that.setData({
              person:res[0],
              hasUserInfo: true
            })
            wx.setStorageSync('person', res[0])
            app.globalData.person=res[0]
          })
        
          
        })
      }
    })
  },
  topersondetail: function () {
    wx.navigateTo({
      url: 'persondetail/persondetail',
    })
  }


})