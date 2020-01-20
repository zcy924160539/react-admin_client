import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'

const { Footer, Sider, Content } = Layout;


/*
管理后台的路由组件
*/
class Admin extends Component {

  render() {
    const user = this.props.user

    // console.log(user)
    // 如果内存没有储存user ==> 当前没有登录
    if (!user || !user._id) {
      // 自动跳转到登录(在render()中)
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: '20px', backgroundColor: '#fff', height: '100%' }}>
            <Switch>
              <Redirect from='/' to='/home' exact />
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Route component={NotFound}/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#aaa' }}>react 后台项目</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default connect(
  state => ({ user: state.user })
)(Admin)