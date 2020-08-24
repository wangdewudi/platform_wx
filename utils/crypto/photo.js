import {
  config
} from "../config.js";

// require('hmac.js');
// require('sha1.js');
// const Crypto = require('crypto.js');

class uploadto {
  uploadfile(
    data,
    name,
    type
  ) {
    const promise = new Promise((resolve, reject) => {
      if (type == "photo") {
         wx.uploadFile({
          url: config.http,
          filePath: data,
          name: 'file',
          formData: {
            name: data,
            key: config.photo + name + ".jpg", ////上传图片的名字和路径（默认路径根目录，自定义目录：xxx/xxx.png）
            policy: "eyJleHBpcmF0aW9uIjoiMjA0MC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==", //测试的网页版打开F12那获得
            OSSAccessKeyId: "LTAI7fZkt67yz9bS",
            success_action_status: "200",
            signature: "M4GFCcz9++C/K5HI29rXvjVvzD8=", //测试的网页版打开F12那获得
          },
          success:res=>{
            console.log(res)
            resolve(res.data)
          },
          fail:res=>{
            reject(res);
          }
        })
      } else {
        wx.uploadFile({
          url: config.http,
          filePath: data,
          name: 'file',
          formData: {
            name: data,
            key: config.video + name + ".mp4", ////上传图片的名字和路径（默认路径根目录，自定义目录：xxx/xxx.png）
            policy: "eyJleHBpcmF0aW9uIjoiMjA0MC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==", //测试的网页版打开F12那获得
            OSSAccessKeyId: "LTAI7fZkt67yz9bS",
            success_action_status: "200",
            signature: "M4GFCcz9++C/K5HI29rXvjVvzD8=", //测试的网页版打开F12那获得
          },
          success:res=>{
            console.log(res)
            resolve(res.data)
          },
          fail:res=>{
            reject(res);
          }
        })
      }
    })
    return promise;
  }

}
// var policyText = {
//   "expiration": "2040-01-01T12:00:00.000Z", // 设置Policy的失效时间，如果超过失效时间，就无法通过此Policy上传文件
//   "conditions": [
//     ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制，如果超过限制，文件上传到OSS会报错
//   ]
// }
// var policyBase64 = Base64.encode(JSON.stringify(policyText))
// console.log(policyBase64)
// var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, "hyISX5jIJqZXd8vGkNbf17Lnayc9To", { asBytes: true });
// var signature = Crypto.util.bytesToBase64(bytes);
// console.log(signature)



export {
  uploadto
}