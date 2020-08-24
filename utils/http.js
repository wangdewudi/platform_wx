import { config } from "config.js";
class HTTP {
  postrequset({ url, data  }) {
  
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: config.base_url_api + url,
        method:"POST",
        data,
        header: {
          'Content-Type': 'application/json'
        },
        success: res => {
          //状态码 toString() 转成字符串
          const statusCode = res.statusCode.toString();
 
          if (statusCode.startsWith("201")) {
            resolve(res.data)
          } else {
            this._show_error();
          }
        },
        fail: res => {
          reject(res);
          this._show_error();
        }
      })
    })
    return promise;
  }
  getrequset({ url, data  }) {
  
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: config.base_url_api + url+"/"+data,
        method:"GET",
        header: {
          'Content-Type': 'application/json'
        },
        success: res => {
          //状态码 toString() 转成字符串
          const statusCode = res.statusCode.toString();

          if (statusCode.startsWith("200")) {
            resolve(res.data)
          } else {
            this._show_error();
          }
        },
        fail: res => {
          reject(res);
          this._show_error();
        }
      })
    })
    return promise;
  }
   puterequset({ url, data  }) {
   
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: config.base_url_api + url,
        method:"PUT",
        data,
        header: {
          'Content-Type': 'application/json'
        },
        success: res => {
          //状态码 toString() 转成字符串
          const statusCode = res.statusCode.toString();
 
          if (statusCode.startsWith("201")) {
            resolve(res.data)
          } else {
            this._show_error();
          }
        },
        fail: res => {
          reject(res);
          this._show_error();
        }
      })
    })
    return promise;
  }
  deleterequset({ url, data  }) {
  
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: config.base_url_api + url+"/"+data,
        method:"DELETE",
        header: {
          'Content-Type': 'application/json'
        },
        success: res => {
          //状态码 toString() 转成字符串
          const statusCode = res.statusCode.toString();
 
          if (statusCode.startsWith("201")) {
            resolve(res.data)
          } else {
            this._show_error();
          }
        },
        fail: res => {
          reject(res);
          this._show_error();
        }
      })
    })
    return promise;
  }
  uploadfile({ url, data ,dataname }) {
   
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: config.base_url_api + url,
        filePath: data,
        name: 'file',
        formData: {
          name: dataname
        },
        success: res => {
          //状态码 toString() 转成字符串
          const statusCode = res.statusCode.toString();
 
          if (statusCode.startsWith("201")) {
           console.log("上传成功")
          } else {
            this._show_error();
          }
        },
        fail: res => {
          reject(res);
          this._show_error();
        }
      })
    })
    return promise;
  }

  _show_error() {
    wx.showToast({
      title: '网络错误',
      icon: 'none'
    })
  }
}
export { HTTP }
