import React, { Component } from 'react'
import { Card, Icon, List, } from 'antd'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'


const { Item } = List

export default class ProductDetail extends Component {
  state = {
    cName1: '',// 一级分类名称
    cName2: '' // 二级分类名称
  }

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product
    if (pCategoryId === 0) {// 一级分类下的商品
      const result = await reqCategory(categoryId)
      if (result.status === 0) {
        const cName1 = result.data.name
        this.setState({ cName1 })
      }
    } else {// 二级分类下的商品
      /*通过多个await方式发多个请求：后面的请求是在前一个请求成功后才开始发送
      // const result1 = await reqCategory(pCategoryId)//获取一级分类列表
      // const result2 = await reqCategory(categoryId)// 获取二级分类列表
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name
      */

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({ cName1, cName2 })
    }
  }
  render() {
    // 读取携带过来的state数据
    const { name, desc, price, detail, imgs } = this.props.location.state.product
    const { cName1, cName2 } = this.state
    const title = (
      <span>
        <LinkButton >
          <Icon
            type='arrow-left'
            style={{ marginRight: 15, fontSize: 20 }}
            onClick={() => this.props.history.push('/product')}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {imgs.map(img => (
                <img src={BASE_IMG_URL + img} key={img} alt="img" className='product-img' />
              ))}
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    )
  }
}