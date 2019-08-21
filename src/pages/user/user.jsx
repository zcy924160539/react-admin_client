import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import formateDate from '../../utils/formateDate'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'

const { confirm } = Modal

/**
用户管理路由
*/
export default class User extends Component {
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色的列表
    isShow: false // 是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        // render: (role_id)=>this.state.roles.find(role=>role._id===role_id).name // 每次都要去遍历寻找，影响效率
        render: (role_id) => this.roleNames[role_id] // 
      },
      {
        title: '操作',
        render: (user) => ( // user:传入点击对应的user
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  /*
  添加或更新用户
  */
  addOrUpdateUser = async () => {
    // 点击确定隐藏表单
    this.setState({ isShow: false })
    // 1. 收集表单数据
    const user = this.form.getFieldsValue()
    // 收集完成重置输入框
    this.form.resetFields()

    // 如果是更新，需要给user指定_id属性
    if (this.user && this.user._id) {
      // 给user指定_id属性
      user._id = this.user._id
    }

    // 2. 提交请求  
    const result = await reqAddOrUpdateUser(user)
    // 3. 重新渲染列表
    if (result.status === 0) {
      message.success(`${this.user ? '修改' : '创建'}用户成功`)
      this.getUsers()
    }
  }

  /*
  根据role的数组，生成包含所有角色名的对象(属性名用角色的id值)
  */
  initRoleNames = (roles) => { //initRoleNames(roles)方法用一个对象roleNames去把统计role._id对应的角色名name保存起来，其中key是role._id的值，value是角色名，最后把这个对象roleNames保存到this中
    const roleNames = roles.reduce((pre, role) => { // roles数组=>roleNames对象
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存roleNames到this中去
    this.roleNames = roleNames
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      // message.success('获取用户列表成功!')
      const { users, roles } = result.data
      this.initRoleNames(roles) // 在发请求获取user和roles的时候，调用initRoleNames(roles)方法，一次性获取所有的role._id对应的角色名name
      this.setState({
        users,
        roles
      })
    } else {
      message.error('获取用户列表失败!')
    }
  }

  // 删除用户
  deleteUser = (user) => {
    confirm({
      title: `确定删除${user.username}吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除成功!')
          this.getUsers() //简单做getUsers()就能更新删除后的列表
        } else {
          message.error('删除失败!')
        }
      },
      // onCancel() {
      //   console.log('Cancel');
      // },
    });
  }

  /*
  显示添加界面
  */
  showAdd = () =>{
    // 先把this.user清空，取除前面保存的this.user
    this.user = null
    // 显示添加界面
    this.setState({ isShow: true })
  }

  /*
  显示修改界面
  */
  showUpdate = (user) => {
    this.user = user
    this.setState({ isShow: true })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  handleCancel = () =>{
    this.setState({ isShow: false })
    // 重置输入框
    this.form.resetFields()
  }

  render() {
    const { users, isShow, roles } = this.state
    const user = this.user || {}
    const title = (
      <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    )
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }} // 在分页器中设置每页显示5条,和跳转到几页
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.handleCancel}
        >
          <UserForm setForm={form => this.form = form} roles={roles} user={user} />
        </Modal>
      </Card>
    )
  }
}
