import React, { Component } from 'react'

import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  state = {
    previewVisible: false, // 标识是否显示大图预览Modal
    previewImage: '', // 大图的url
    fileList: [
      // {
      //   uid: '-1',// 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
      //   name: 'image.png',// 文件名
      //   status: 'done',// 图片的状态，状态有：uploading done error removed
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', //图片的地址
      // },
    ]
  }

  constructor(props) {
    super(props)
    let fileList = []
    // 如果传入了imgs属性
    const { imgs } = props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,// 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: img,// 文件名
        status: 'done',// 图片的状态，状态有：uploading done error removed
        url: BASE_IMG_URL + img, //图片的地址
      }))
    }
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList //所有已上传图片的数组
    }
  }


  /*
  获取所有已上传图片文件名的数组
  */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  // 隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    // 指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
  handleChange参数是个对象：{
    file: 当前操作的图片文件(上传/删除)
    fileList: 所有已上传图片的数组
    event: 
  }
  */
  handleChange = async ({ file, fileList }) => {

    // 一但上传成功，将当前上传的file的信息修正(name,url)
    if (file.status === 'done') { // 上传图片完成
      // console.log(file)
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功!')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败!')
      }
    } else if (file.status === 'removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }

    //操作的过程中及时去更新fileList的状态
    this.setState({ fileList })
  }


  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" // 图片上传的接口地址
          accept='image/*' // 只接受图片格式
          listType="picture-card" // 卡片样式的图片
          name='image' // 请求参数名
          fileList={fileList} // 已经上传的文件列表(数组)
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}{/*限制图片上传的数量*/}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}