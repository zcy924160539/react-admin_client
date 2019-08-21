import React, { Component } from 'react'
import { Route, Switch,Redirect } from 'react-router-dom'
import ProductHome from './home'
import ProductAppUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

/*
产品路由 
 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact={true}></Route>{/*exact路径完全匹配*/}
        <Route path='/product/addupdate' component={ProductAppUpdate}></Route>
        <Route path='/product/detail' component={ProductDetail}></Route>
        <Redirect to='/product' />
      </Switch>
    )
  }
}
