/*
reducer函数模块
*/

import { combineReducers } from 'redux'
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER,ADD_PRODUCT } from './action-type'
import storageUtils from '../utils/storageUtils'


// setHeadTitle 用来管理标题的reducer函数
const initHeadTitle = '首页'
function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

// user 用来管理登录用户的reducer函数
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      // state.erroeMsg = erroeMsg // 不要直接修改原本的状态数据
      return { ...state, errorMsg }
    case RESET_USER:
      return {}
    default:
      return state
  }
}

// product 用来管理商品的reducer函数
function product(state={},action){
  switch (action.type){
    case ADD_PRODUCT:
      return action.product
    default:
      return state
  }
}

export default combineReducers({
  headTitle,
  user,
  product
})