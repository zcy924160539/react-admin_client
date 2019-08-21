import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import { Menu, Icon } from 'antd'
const { SubMenu } = Menu;
class LeftNav extends Component {
  /*
    根据menu的数据数组，生成对应的标签数组
    使用map() + 递归调用
  */
  // getMenuNodes_map = (menuList) => {
  //   return menuList.map(item => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key}>
  //           <Link to={item.key}>
  //             <Icon type={item.icon} />
  //             <span>{item.title}</span>
  //           </Link>
  //         </Menu.Item>
  //       )
  //     } else {
  //       return (
  //         <SubMenu
  //           key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //           {/* {
  //             item.children.map(item => {
  //               return (
  //                 <Menu.Item key={item.key}>
  //                   <Link to={item.key}>
  //                     <Icon type={item.icon} />
  //                     <span>{item.title}</span>
  //                   </Link>
  //                 </Menu.Item>
  //               )
  //             })
  //           } */}

  //           {/* 递归调用 */
  //             this.getMenuNodes(item.children)
  //           }
  //         </SubMenu>
  //       )
  //     }
  //   })
  // }

  /*
  当前登录用户对item是否有权限
  */
  hasAuth = (item) => {
    // item是菜单项
    const { key, isPublic } = item

    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限:key有没有menus中
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    }else if(item.children){ // 4. 如果当前用户有此item的某个item权限
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }
  }

  /*使用reduce() + 递归*/
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限,才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {
          // 向pre中添加<Menu.Item>
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0) // 判断cItem.key是不是以/product开头
          // 如果存在，说明当前item的子列表需要打开
          if (cItem) this.openKey = item.key

          // 向pre中添加<SubMenu.Item>
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {/* 递归调用 */
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ))
        }
      }
      return pre
    }, [])
  }

  // 在第一次render()之前执行一次
  // 为第一次render()准备数据(必须同步)
  componentWillMount() {
    this.menuNode = this.getMenuNodes(menuList)
  }

  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {// 当前的是商品或其子路由界面(/product/detail)
      path = '/product' //让product的子路由也匹配/product路径
    }
    const openKey = this.openKey
    return (
      <div className='left-nav'>
        <Link to='/home' className='left-nav-header'>
          <img src={logo} alt="logo" />
          <h2>react 后台</h2>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {this.menuNode}
        </Menu>
      </div>
    )
  }
}
// withRouter高阶组件,包装LeftNav,给LeftNav传递路由的属性
export default withRouter(LeftNav)