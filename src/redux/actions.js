/*
action Creators
*/
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER, ADD_PRODUCT } from './action-type'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

/*
设置头部标题的同步action
*/
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

/*
接收用户的同步action
 */
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })

/*
显示错误信息同步的action
*/
export const showErrorMsg = (errorMsg) => ({ type: SHOW_ERROR_MSG, errorMsg })

/*
实现登出的action
*/
export const logout = () => {
  // 先清除localstorage中的user
  storageUtils.removeUser()
  return { type: RESET_USER }
}

/*
添加商品的同步action
*/
export const addProduct = (product) => ({ type: ADD_PRODUCT, product })

/*
实现登录的异步action 
*/
export const login = (username, password) => async dispatch => {
  // 1.执行异步ajax请求
  const result = await reqLogin(username, password)
  // 2.1 如果成功了，分发成功的同步action
  if (result.status === 0) {
    const user = result.data
    // user还要保存到localstorage中
    storageUtils.saveUser(user)
    // 分发接收用户的同步action
    dispatch(receiveUser(user))
  } else { // 2.2 如果失败了，分发失败的同步action
    const msg = result.msg
    dispatch(showErrorMsg(msg))
  }
}

