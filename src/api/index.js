/*
要求:根据接口文档定义接口请求函数
包含应用中所有接口请求函数的模块
每个接口函数的返回值都是promise
*/
import ajax from './ajax'
// export function reqLogin(username,password){
//   return ajax('/login',{username,password},'POST')
// }
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = ''
// 登录请求
export const reqLogin = (username, password) => ajax(`${BASE}/login`, { username, password }, 'POST')

// 获取天气信息
/*
jsonp请求的接口请求函数
*/
export const reqWeather = (city) => {
  return new Promise((resovle, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {// 成功
        // 取出需要的数据(天气图片，和天气状况)
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resovle({ dayPictureUrl, weather })
      } else { // 失败
        message.error('获取天气信息失败:' + err)
      }
    })
  })
}

// 获取一级或某个二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })//type 的默认值是GET

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax(BASE + '/manage/category/update', { categoryName, categoryId }, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 搜索产品分页列表(根据商品名称/商品描述搜索)
// (searchType:搜索的类型，productName/productDesc)   [searchType]这种写法，代表的是searchType这个属性的值，也就是[searchType]是productName，productDesc其中一个
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', { pageNum, pageSize, [searchType]: searchName })

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+ (user._id?'update':'add'), user, 'POST')