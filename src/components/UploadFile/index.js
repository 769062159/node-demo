import React, { PureComponent } from 'react';
import { Upload, message, Button, Icon } from 'antd';

export default class UploadFile extends PureComponent {
  constructor(props) {
    super(props);
    const { type, id } = this.props;
    this.state = {
      header: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      payload: {
        type,
        account_id: id,
      },
    };
  }
  // state = {
  //     header: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //     payload: {
  //         type: 2,
  //     },
  // };
  onChange = info => {
    if (info.file.status === 'done') {
      message.success(`文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`文件上传失败`);
    }
  };
  beforeUpload = file => {
    const { appid } = this.props;
    if (!appid) {
      message.error('请先激活小程序appid！');
      return false;
    }
    let { name } = file;
    name = name.split('.')[1];
    console.log(name);
    const isTrue = name === 'pem';
    if (!isTrue) {
      message.error('请上传正确格式的证书！');
    }
    return isTrue;
  };
  render() {
    const { uploadUrl, status, id } = this.props;
    const { header, payload } = this.state;
    payload.account_id = id;
    return (
      <Upload
        action={uploadUrl}
        headers={header}
        data={payload}
        onChange={this.onChange}
        beforeUpload={this.beforeUpload}
      >
        <Button>
          <Icon type="upload" /> 上传文件
        </Button>
        {status ? ' 已上传' : ''}
      </Upload>
    );
  }
}
