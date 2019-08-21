import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

/*
添加分类的form
*/
class AddForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired, //用来传递form对象的函数
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {// 指定Item布局的配置对象
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 },//右侧包裹的宽度
    };
    return (
      <Form>
        <Item label='角色名称' {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules:[
                {required:true,message:'角色名必须输入'}
              ]
            })(
              <Input placeholder='请输入角色名' />
            )
          }
        </Item>
      </Form>
    )
  }
}
const WrapAddForm = Form.create()(AddForm)
export default WrapAddForm
