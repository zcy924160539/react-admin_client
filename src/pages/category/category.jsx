import React, { Component } from 'react'
import { Card, Icon, Button, Table, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import {PAGE_SIZE} from '../../utils/constants'


/*
商品分类路由
*/

export default class Category extends Component {
  state = {
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类列表
    loading: false, // 是否正在获取数据中
    parentId: '0', // 当前需要显示的分类列表的父分类parentId
    parentName: '', // 当前需要显示的分类列表的父分类名称
    showStatus: 0 // 标识添加/更新的确认框是否显示,0：都不显示，1：显示添加，2:显示更新
  }

  /*
  初始化Table所有列的数组
  */
  initcolumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/* 如何向事件回调函数传递参数:先定义一个匿名函数，在匿名函数中调用处理函数并传入数据(参数) */}
            {this.state.parentId === '0' ? (<LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>) : null}
          </span>
        )
      }
    ]
  }

  //异步获取一级/二级分类列表显示  
  // parentId：如果没有指定就用状态(this.state)中的parentId,如果参数中传入了，就用参数中传入的parentId
  getCategorys = async (parentId) => {
    // 在发请求前显示loading
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    // 发异步ajax请求获取数据
    const result = await reqCategorys(parentId)
    // 请求结束后,隐藏loading
    this.setState({ loading: false })
    if (result.status === 0) {
      // 取出分类数组(可能是一级的，也可能是二级到)
      const categorys = result.data
      if (parentId === '0') { // 一级分类
        // 更新一级分类状态
        this.setState({ categorys })
      } else { // 二级分类
        // 更新二级分类状态
        this.setState({ subCategorys: categorys })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  /*
  显示指定一级分类对象的二级列表
  */
  showSubCategorys = (category) => {
    // 更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { // 在状态更新重新render()后执行
      // 发请求获取二级分类列表
      this.getCategorys()
      // console.log(this.state.parentId, this.state.parentName)
    })
    // setState之后不能立即获取最新状态，因为setState()是异步更新状态的
  }

  /*
  显示一级分类列表
  */
  showCategorys = () => {
    // 让parentId为0,parentName为空，subCategorys清空
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /*
  响应点击取消：隐藏确定框
  */
  handleCancel = () => {
    this.form.resetFields()
    // 隐藏确认框
    this.setState({ showStatus: 0 })
  }

  /*
  显示添加的确框
  */
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }



  /*
  显示添加分类的确认框
  */
  addCategory = () => {
    this.form.validateFields(async (err, values) => {// 表单前台验证
      if (!err) {
        // console.log('addCategory()')
        // 1.隐藏确认框
        this.setState({ showStatus: 0 })
        // 2.收集数据,并提交添加分类的请求
        /*
        注意:获取两个或以上的数据，要用 getFieldsValue() 复数，而不是单数的getFieldValue(),
        getFieldValue()方法只能获取一个数据 ，getFieldValue()方法取值时不能结构赋值
        */
        // const { parentId, categoryName } = this.form.getFieldsValue()
        const { parentId, categoryName } = values // 表单验证后直接从values中就可以得到输入的数据了
        // 清除输入数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if (result.status === 0) {
          // 3. 添加当前分类列表下的分类
          if (parentId === this.state.parentId) {
            // 重新获取当前分类列表显示
            this.getCategorys()
          } else if (parentId === '0') {//在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级分类列表
            this.getCategorys('0')
          }
        } else {
          message.error('添加分类失败')
        }
      }
    })
  }


  /*
  显示修改分类的确认框
  */
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    this.setState({ showStatus: 2 })
  }

  /*
  显示更新分类的确认框
  */
  updateCategory = () => {
    // 进行表单验证，只有通过了才处理
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1.隐藏确定框
        this.setState({ showStatus: 0 })
        // 准备数据
        const categoryId = this.category._id
        const { categoryName } = values
        // 清除输入数据
        this.form.resetFields()
        // 2.发请求更新分类
        const result = await reqUpdateCategory({ categoryName, categoryId })
        if (result.status === 0) {
          // 3.重新显示新的列表
          this.getCategorys()
        } else {
          message.error('获取更新数据失败')
        }
      }
    })

  }


  // 为第一次render准备数据
  componentWillMount() {
    this.initcolumns()
  }

  // 发送异步ajax请求
  componentDidMount() {
    this.getCategorys()
  }

  render() {
    // 读取状态数据
    const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
    // 读取指定分类
    const category = this.category || {} // 如果没有，指定一个空对象，以防报错
    // card的左侧标题
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: 5 }} />
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered={true}
          rowKey='_id'
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }} // 在分页器中设置每页显示5条,和跳转到几页
          loading={loading}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={form => this.form = form}
          />

        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
        </Modal>
      </Card>
    )
  }
}
