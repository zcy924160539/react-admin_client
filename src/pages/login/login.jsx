import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button, message } from 'antd';
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storeUtils from '../../utils/storeUtils'
// const Item = Form.Item // 不能写在import之前

/* 
登录的路由组件
*/
class Login extends Component {
  handleSubmit = (event) => {
    // 阻止默认提交
    event.preventDefault()

    // 点击时，对所有表单字段进行统一校验
    this.props.form.validateFields(async (error, values) => {
      //校验成功
      if (!error) {
        // 提交登录的ajax请求(post请求)
        const { username, password } = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {// 登陆成功
          // 提示登陆成功信息
          message.success('登陆成功',.7)

          // 保存user
          const user = result.data

          memoryUtils.user = user // 保存在内存里面
          
          storeUtils.saveUser(user) // 保存到localStorage中去
          // 跳转到后台管理界面（登录后，不需要再回跳回登录界面了,所以不用push()方法来跳转路由，而是用replace方法来跳转路由）
          this.props.history.replace('/')
        } else { // 登录失败
          // 提示登录失败信息
          message.error(result.msg)
        }
      } else {
        console.error('校验失败')
      }
      /* 
      async和await
      1. 作用: 
        1).简化promise对象的使用：不用再使用then()来指定成功/失败时的回调
        2).以同步编码(没有回调函数)方式实现异步流程 
      2. 哪里写await?
        在返回promise的表达式左侧写await: 不想要promise，只想要promise异步执行成功的value数据
      2. 哪里写async?
        await所在的函数(最近的)定义的左侧写async
      */
    });
    /*
    得到form对象
    const form = this.props.form
    const values = form.getFieldsValue()
    console.log(values)
    */

  }

  /*
  对密码进行自定义验证
   */

  /* 
 用户名/密码的合法性要求
 1). 必须输入
 2).必须大于等于4位
 3).必须小于等于12位
 4).必须是英文，数字或下划线组成
  */
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
    // callback('xxxx) // 验证失败，并指定提示的文本
  }

  render() {
    const {user} = memoryUtils
    // 如果用户已经登录，自动跳转到管理界面
    if(user && user._id){
      return <Redirect to='/' />
    }

    // 得到form对象(form有获取数据和表单验证的功能)
    const form = this.props.form
    const { getFieldDecorator } = form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {/* 
                用户名/密码的合法性要求
                1). 必须输入
                2).必须大于4位
                3).必须小于12位
                4).必须是英文，数字或下划线组成
              */}
              {getFieldDecorator('username', {//username作为标识
                // 声明式验证
                rules: [// 验证规则，和提示信息(配置对象)
                  { required: true, whitespace: true, message: '用户名必须输入' },
                  { min: 4, message: '用户名不能小于四位' },
                  { max: 12, message: '用户名不能大于十二位' },
                  { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名必须是英文开头，由英文，数字或下划线组成' },
                ],
                // 指定初始值
                initialValue: 'admin'
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {//自定义校验
                rules: [{ validator: this.validatorPwd }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

/*
1. 高阶函数
Form.create()函数是高阶函数，它的返回值是一个函数
2. 高阶组件
    1).本质就是一个函数
    2).接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
    3).作用：拓展组件的功能（传属性等功能）
    4).高阶组件也是高阶函数：接收一个组件函数，返回是一个新的函数
Form.create()返回的那个函数就是一个高阶组件
WrapLogin是一个包装以后的组件
Login是被包装的组件，是WrapLogin的子组件，WrapLogin会向Login传入form属性
*/

/*
包装Form组件生成一个新的组件：Form(Login)
新组件会想Form传递一个强大的对象属性：form
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

/*
1.前台表单认证
2.收集用户输入数据
*/