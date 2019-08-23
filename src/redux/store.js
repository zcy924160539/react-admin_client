/*
redux的核心模块store模块
*/

import { createStore, applyMiddleware } from 'redux'
// 引入reducer
import reducer from './reducer'

// 引入异步中间件
import thunk from 'redux-thunk'

// 引入浏览器工具插件
import { composeWithDevTools } from 'redux-devtools-extension'

// 创建store对象
export default createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)