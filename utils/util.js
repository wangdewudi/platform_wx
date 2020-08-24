import {HTTP} from "../utils/http";
class utilhttp extends HTTP{
  // user表操作
 getUseruid(data){
  return this.getrequset({
    url:"user",
    data:data+"&uid"
  })
 }
 getResuseropenid(data){
  return this.getrequset({
    url:"resuser",
    data:data+"&openid"
  })
 }
 addUser(data){
  return this.postrequset({
    url:"user",
    data:data
  })
 }
 getResuser(data){
  return this.getrequset({
    url:"resuser",
    data:data
  })
  
}
addMessage(data,send){
  return this.postrequset({
    url:"finalmessage",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    data:data
  })

}
getMessage(data){
  return this.getrequset({
    url:"finalmessage",
    data:data
  })
  
}
sendcomment(data){
  return this.postrequset({
    url:"comment",
    data:data
  })  
}
getcomment(data,page,type){
  return this.getrequset({
    url:"finalcomment",
    data:data+"&"+page+"&"+type
  })
  
}
}
export {utilhttp};











// function promiseAjax(_url,type,data){
//   return new Promise(function (resolve, reject) {
//     wx.request({
//       url:_url,
//       method:type,
//       data,
//       success(res){//--成功回调
//         resolve(res);
//       },
//       fail(err){//--失败回调
//         reject(err)
//       }
//     })
//   })
// }
// module.exports = {
//     promiseAjax //---promise封装函数导出
// }


