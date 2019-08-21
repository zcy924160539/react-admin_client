import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option

/*
添加/修改用户的form
*/
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, //用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  // 密码的自定义校验函数
  validatorPwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度不能小于四位')
    } else if (value.length > 12) {
      callback('密码长度不能大于十二位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须由英文，数字或下划线组成')
    } else {
      callback()
    }
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
    const { roles, user } = this.props
    // console.log(user)
    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, whitespace: true, message: '用户名必须输入' },
                { min: 4, message: '用户名不能小于四位' },
                { max: 12, message: '用户名不能大于十二位' },
                { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名必须是英文开头，由英文，数字或下划线组成' }
              ]
            })(
              <Input placeholder='请输入用户名' />
            )
          }
        </Item>
        {user._id ? null : (<Item label='密　码'>
          {
            getFieldDecorator('password', {
              initialValue: '',
              rules: [{ required: true }, { validator: this.validatorPwd }],
            })(
              <Input placeholder='请输入密码' type='password' />
            )
          }
        </Item>)}
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                { required: true, message: '电话号码必须输入' },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
              ]
            })(
              <Input placeholder='请输入手机号' type='tel' />
            )
          }
        </Item>
        <Item label='邮　箱'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { required: true, message: '邮箱必须输入' },
                { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
              ]
            })(
              <Input placeholder='请输入邮箱' />
            )
          }
        </Item>
        <Item label='角　色'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
            })(
              <Select>
                {
                  roles.map(role => (
                    <Option value={role._id} key={role._id}>{role.name}</Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
const WrapAddForm = Form.create()(UserForm)
export default WrapAddForm
