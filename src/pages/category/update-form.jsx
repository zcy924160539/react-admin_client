import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
const Item = Form.Item
/*
更新分类的form
*/
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    // 将form对象通过setForm方法传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const { categoryName } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName, //初始值
              rules: [
                { required: true ,message:'分类名必须输入'}
              ]
            })(
              <Input placeholder='请输入分类名称' />
            )
          }
        </Item>
      </Form>
    )
  }
}
const WrapAddForm = Form.create()(UpdateForm)
export default WrapAddForm
