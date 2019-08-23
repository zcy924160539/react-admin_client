import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/formateDate'

/**
角色管理路由
 */
export default class Role extends Component {
  state = {
    roles: [], // 所有角色列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false // 是否显示设置权限界面
  }
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: create_time => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate // 可以直接写个函数名，让render直接带值去调用这个函数，得到的就是formateDate的返回值
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  onRow = (role) => {
    return {
      onClick: event => {
        // console.log(role)
        this.setState({ role })
      }
    }
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    } else {
      message.error('请求失败')
    }
  }


  // 添加角色
  addRole = () => {
    // 先进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {// 验证通过
        this.setState({ isShowAdd: false })//隐藏确认框
        // 收集输入数据
        const { roleName } = values
        this.form.resetFields()// 清空输入框
        // 请求添加
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles()
          // 产生新的角色
          const role = result.data
          // 更新roles状态

          /*不推荐直接修改state里面的数据 */
          // const roles = this.state.roles
          // roles.push(role)
          // this.setState({ roles })

          /*
          推荐写法: 基于原本状态数据更新
          */
          this.setState(state => ({//函数写法(原始用法),参数里面除了可以传state，还能传props
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
  }

  // 更新角色
  updateRole = async () => {
    this.setState({ isShowAuth: false })//隐藏确认框
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username// 设置授权人
    // 请求更新
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限，强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色权限已修改，请重新登录')
      } else {
        message.success('设置角色权限成功')
        this.setState({
          roles: [...this.state.roles]
        })
      }
    } else {
      message.error('设置角色权限失败')
    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => { this.setState({ isShowAuth: true }) }}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
          rowSelection={{ 
            type: 'radio', 
            selectedRowKeys: [role._id],
            onSelect: (role)=>{ // 选择某个radio时的回调
              this.setState({ role })
            } 
          }}
          onRow={this.onRow}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => { this.form.resetFields(); this.setState({ isShowAdd: false }) }}
        >
          <AddForm
            setForm={form => this.form = form}
          />
        </Modal>

        <Modal
          title="设置角色的权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => { this.setState({ isShowAuth: false }) }}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}
