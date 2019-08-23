/*
reducer函数模块
*/

import {combineReducers} from 'redux'
import {SET_HEAD_TITLE} from './action-type'


// setHeadTitle
const initHeadTitle = '首页'
function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}
export default combineReducers({
  headTitle
})