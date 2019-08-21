import React, { Component } from 'react'
import { Card, Form, Input, Icon, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input

class ProductAppUpdate extends Component {
  state = {
    options: [],
  }

  constructor(props) {
    super(props)

    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  initOption = async (categorys) => {
    // 根据categorys生成options
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))
    // 如果是个二级分类商品更新
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option上
      targetOption.children = childOptions
    }

    // 更新options状态
    this.setState({ options })
  }

  /*
  异步获取一级或二级分类列表并显示
  */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {// 如果是一级分类列表
        this.initOption(categorys)
      } else { // 二级列表
        return categorys // 返回二级列表 ==> 当千async函数返回的promise就会成功且value为categorys
      }
    }
  }


  submit = () => {
    // 进行表单验证，如果通过了，才发送请求
    this.props.form.validateFields(async (err, values) => {
      if (!err) {//验证通过

        // 1.收集数据,并封装成product对象
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs() // 得到图片数组数据
        const detail = this.editor.current.getDetail() // 得到富文本编辑器的输入信息

        const product = { name, desc, price, imgs, detail,pCategoryId, categoryId }

        // 如果是更新，需要添加 _id 
        if (this.isUpdate) {
          product._id = this.product._id
        }

        // 2.调用接口请求函数去添加或者更新
        const result = await reqAddOrUpdateProduct(product)

        // 3.根据结果提示
        if (result.status === 0) {
          message.success(`${this.isUpdate?'更新商品成功':'添加商品成功'}`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate?'更新商品失败':'添加商品失败'}`)
        }

      }
    })
  }

  /*
  验证价格的函数
  */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  /*loadData方法加载下一级列表的数据 */
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];

    // 请求数据成功前显示loading的效果
    targetOption.loading = true;

    // 根据选择的分类，请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 请求数据成功后隐藏loading的效果
    targetOption.loading = false;
    // 二级分类列表有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成二级列表options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true, // 不是叶子
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { //当前选择的分类没有二级分类
      targetOption.isLeaf = true // 是叶子
    }
    this.setState({
      options: [...this.state.options]
    });
  }

  componentWillMount() {
    // 取出携带的state
    const product = this.props.location.state // 如果是添加没值，否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product
    // 保存商品(如果没有，保存的是空对象，防止报错)
    this.product = product || {}
    // console.log(this.product)
  }

  componentDidMount() {
    this.getCategorys('0')
  }
  render() {
    const { isUpdate, product } = this
    const { categoryId, pCategoryId, imgs, detail } = product
    // 用来接收级联分类Id的数组
    const categoryIds = []
    if (isUpdate) {

      if (pCategoryId === '0') {// 商品是一级分类的商品
        categoryIds.push(categoryId)
      } else {// 商品是一级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const formItemLayout = {// 指定Item布局的配置对象
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 },//右侧包裹的宽度
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.push('/product')}>
          <Icon
            type='arrow-left'
            style={{ fontSize: 20 }}
          />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const { getFieldDecorator } = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                { required: true, message: '必须输入商品名称' }
              ]
            })(
              <Input placeholder='请输入商品名称' ></Input>
            )}
          </Item>
          <Item label='商品描述'>
            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                { required: true, message: '必须输入商品描述' }
              ]
            })(
              <TextArea placeholder='请输入商品描述' autosize={{ minRows: 2 }}></TextArea>
            )}
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '必须输入商品价格' },
                  { validator: this.validatePrice }//	自定义校验
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
              )
            }
          </Item>
          <Item label='商品分类'>
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                { required: true, message: '必须指定商品分类' },
              ]
            })(
              <Cascader
                placeholder='请指定商品分类'
                options={this.state.options} /*需要显示的列表数据*/
                loadData={this.loadData} /*当选择某个列表项，加载下一级列表的监听回调 */
              />
            )}
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAppUpdate)

