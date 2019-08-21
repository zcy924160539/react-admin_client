import React, { Component } from 'react'
import './index.less'
import { reqWeather } from '../../api'
import formateDate from '../../utils/formateDate'
import memoryUtils from '../../utils/memoryUtils'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal, message } from 'antd'
import storeUtils from '../../utils/storeUtils'
import LinkButton from '../link-button'

const { confirm } = Modal;

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  }

  getTime = () => {
    // 每隔一秒获取当前时间，并更新状态数据
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      // 更新状态
      this.setState({ currentTime })
    }, 1000)
  }
  getWeather = async () => {
    const result = await reqWeather('茂名')
    const { dayPictureUrl, weather } = result
    // 更新状态
    this.setState({ dayPictureUrl, weather })
  }

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title//外层item
      } else if (item.children) {//内层item，item.children
        // 在所有的子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if (cItem) {//如果有值说明能匹配
          title = cItem.title
        }
      }
    })
    return title
  }

  // 退出登录
  logOut = () => {
    //显示确认框
    confirm({
      content: '确定退出吗?',
      okText:'确定',
      cancelText:'取消',
      onOk: () => { // 注意这里的this指向,最好改成箭头函数
        // console.log('ok',this)
        // 删除localStorage和memoryUtils.user中的用户信息
        storeUtils.removeUser()
        memoryUtils.user = {}
        // 跳转到登录页面
        this.props.history.replace('/login')
        message.success('已退出', .7)
      }
    });
  }
  componentDidMount() {
    // 获取当前时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }

  /* 
  当前组件销毁之前的生命周期函数
  */
  componentWillUnmount() {
    // 清除获取当前时间定时器
    clearInterval(this.intervalId)
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state
    const { username } = memoryUtils.user
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header'>
          <div className="header-top">
            <span>欢迎,{username}</span>
            <LinkButton onClick={this.logOut}>退出</LinkButton>
          </div>
          <div className="header-bottom">
            <div className='header-bottom-left'>{title}</div>
            <div className='header-bottom-right'>
              <span>{currentTime}</span>
              <img src={dayPictureUrl} alt="weather" />
              <span>{weather}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)