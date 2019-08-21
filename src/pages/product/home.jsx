import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select

export default class ProductHome extends Component {
  state = {// 商品的数组
    total: 0,
    products: [],
    loading: false, // 是否正在加载中
    searchName: '', // 搜索关键字
    searchType: 'productName' // 根据哪个字段进行搜索，默认根据名称搜索
  }
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        width: 100,
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price // 指定了对应的属性,传入了对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const { status, _id } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    this.pageNum = pageNum //保存pageNum,让其他方法可以看到页码
    this.setState({ loading: true })//显示loading
    const { searchName, searchType } = this.state
    let result
    if (searchName) {
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })//隐藏loading
    if (result.status === 0) {//请求成功
      // 获取数据
      const { total, list } = result.data
      // 改变状态
      this.setState({ total, products: list })
    } else {
      message.error('获取商品信息失败')
    }
  }

  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    } else {
      message.error('更新商品失败')
    }
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const { products, total, loading, searchName, searchType } = this.state
    const title = (
      <span>
        <Select value={searchType} style={{ width: 150 }} onChange={value => this.setState({ searchType: value })}>{/*受控组件*/}
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' value={searchName} style={{ width: 150, margin: '0 15px' }} onChange={event => this.setState({ searchName: event.target.value })}></Input>{/*受控组件*/}
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          dataSource={products}
          columns={this.columns}
          bordered
          loading={loading}
          pagination={
            {
              current:this.pageNum,
              total,//总数
              defaultPageSize: PAGE_SIZE,//一页显示多少条信息的常量
              showQuickJumper: true,//根据输入页码跳转到第几页
              onChange: this.getProducts//分页时发请求去加载分页内容
            }
          }
        />
      </Card>
    )
  }
}
