/*
能发送ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1:统一处理请求异常?
    方法:在外层包一个自己的创建的Promise对象
    在请求出错时，不reject(error)，而是显示错误提示(用antd的message组件)
2. 优化2: 异步得到不是response，而是result:resolve(response.data)    
*/


/*
接口由4个部分组成，其中3个部分（url，type，data(参数)）决定请求，第4个是响应格式
*/
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {

  return new Promise((resolve, reject) => {
    let promise
    // 1. 执行异步ajax请求
    if (type === 'GET') { // get请求
      promise = axios.get(url, { // 配置对象
        params: data // 指定请求参数
      }).then()
    } else { // post请求
      promise = axios.post(url, data)
    }

    // 2. 如果成功，调用resolve(value)
    promise.then(response => {
      // 异步得到不是response，而是result:resolve(response.data),在调用函数发请求的时候，成功时直接拿到result
      resolve(response.data)
    })

      // 3. 如果失败，不调用reject(reason)，而是提示异常信息
      .catch(error => {
        message.error('请求出错了:' + error.message)
      })
  })

}

// 请求登录的接口
// ajax('http://localhost:5000/login',{username:'admin',password:'admin'},'POST').then()