//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    that.globalData.topdata.top= (menuButtonInfo.top - systemInfo.statusBarHeight) * 2+ systemInfo.statusBarHeight;
    // that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    that.globalData.topdata.right = systemInfo.screenWidth - menuButtonInfo.right;
    // that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    that.globalData.topdata.height = menuButtonInfo.height+menuButtonInfo.top - systemInfo.statusBarHeight;
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    that.globalData.pxToRpxScale =pxToRpxScale
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // 导航栏的高度
    let navigationHeight = 44 * pxToRpxScale
    // window的宽度
    let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
    // 屏幕的高度
    let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
    this.globalData.screentHeight=systemInfo.windowHeight

    // 底部tabBar的高度
    that.globalData.tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
  

    that.globalData.person = wx.getStorageSync('person')
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var appid = "wx2813105ca4d79666";
          var secret = "b39acf9d49401e6a21f0e34d3ced00b6";
          var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          // var appid = "1110627553";
          // var secret = "tqIesfveooHQw2PJ";
          // var url = 'https://api.q.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
            success: function (res) {
              // res.data.openid 即为所求openid
              // console.log(res.data);
              that.globalData.openid = res.data.openid
              wx.setStorageSync('openid', res.data.openid)
              
            }

          });
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo
              // console.log( res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              this.globalData.person = wx.getStorageSync('person')
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    person: {
      user: null,
      school: null,
      campus: null,
      userschoo: null
    },
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    menuTop:0,
    pxToRpxScale:0,//排序和rpx比例
    tabBarHeight:0,//底部导航栏高度
    screentHeight:0,//屏幕高度
    topdata: {
      right: 0,
      top: 0,
      height: 0,
      name: "万创校园"
    },
    openid: ""
  }
})