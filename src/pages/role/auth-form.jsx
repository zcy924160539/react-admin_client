import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree

/*
添加分类的form
*/
export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)

    // 根据传入角色的menus生成初始状态
    const { menus } = props.role
    this.state = {
      checkedKeys: menus
    }
  }


  // 为父组件提供获取最新menus的方法
  getMenus = () => this.state.checkedKeys

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  // 根据新传入的role来更新checkedKeys状态
  // 该生命周期函数是在组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({ checkedKeys: menus })
  }

  render() {
    const formItemLayout = {// 指定Item布局的配置对象
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 },//右侧包裹的宽度
    }
    const { role } = this.props
    const { checkedKeys } = this.state
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title='平台权限管理' key='all'>
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}