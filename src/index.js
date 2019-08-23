/* 
入口js文件
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import { Provider } from 'react-redux'
import store from './redux/store'

// 读取local中保存的user
const user = storageUtils.getUser()
// 把user保存到内存中
memoryUtils.user = user

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
)
, document.getElementById('root'))