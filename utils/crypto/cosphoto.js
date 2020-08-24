import {
    config
} from "../config.js";
var COS = require('../../lib/cos-wx-sdk-v5.js');

// 创建实例

var cos = new COS({

    SecretId: 'AKID1f5GOICNFsJV6QILw5ykUbT9uQkojeEY',

    SecretKey: 'FXbf4D4qRntknUw8ECxTn38mHXdIm9pB'

});

// 分片上传







class uploadto {
    uploadfile(
        data,
        name,
        type
    ) {
        const promise = new Promise((resolve, reject) => {
            if (type == "photo") {
                cos.postObject({
                        Bucket: 'wcxy-1258824738', // Bucket 格式：test-1250000000
                        Region: 'ap-chengdu',
                        Key: 'wcxy/photo/' + name + ".jpg",
                        FilePath: data
                    },
                    function (err, res) {
                        if (err != null){
                            wx.showToast({
                              title: '上传失败',
                            })
                            reject(err);
                        }
                        else resolve(res);
                    })
            } else {
                cos.postObject({
                        Bucket: 'wcxy-1258824738', // Bucket 格式：test-1250000000
                        Region: 'ap-chengdu',
                        Key: 'wcxy/photo/' + name + ".mp4",
                        FilePath: data
                    },
                    function (err, res) {
                        if (err != null)
                            reject(err);
                        else resolve(res);
                    })
            }
        })
        return promise;
    }
}

export {
    uploadto
}