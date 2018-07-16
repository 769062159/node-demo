import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  // Row,
  // Col,
  message,
  Upload,
  Modal,
  Row,
  Form,
  Tag,
  //   Select,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  // InputNumber,
  // DatePicker,
} from 'antd';
// import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ config, loading }) => ({
  config,
  loading: loading.models.config,
}))
@Form.create()
export default class Config extends PureComponent {
  state = {
    // selectedRows: [],
    previewVisible: false,
    previewImage: '',
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    // selectOption: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/fetchConfig',
    });
  }
  handleCancel = () => this.setState({ previewVisible: false });

  // 新增修改提交
  handleSubmit = e => {
    e.preventDefault();
    const data = {};
    const { config: { list } } = this.props;
    if (list.length) {
      data.index_ad = list[0].url;
    } else {
      message.error('请上传图片');
      return false;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'config/addConfig',
      payload: data,
    });
    message.success('添加成功');
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => {
    if (fileList.length) {
      const arr = [];
      fileList.forEach(item => {
        if (item.status === 'done' && item.uploaded !== 'done') {
          const img = {};
          img.status = 'done';
          img.uploaded = 'done';
          img.response = { status: 'success' };
          img.name = item.name;
          img.uid = item.uid;
          img.url = item.response.data;
          arr.push(img);
          // return img;
          // this.props.onChange([img]);
          // const { dispatch } = this.props;
          // dispatch({
          //   type: 'config/setAdsBackground',
          //   payload: {
          //     fileList: [img],
          //   },
          // });
        }
        // return item;
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'config/setAdsBackground',
        payload: {
          fileList: arr,
        },
      });
    }
  };
  removeImg = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/clearBackground',
    });
  };

  render() {
    const { config: { list }, loading } = this.props;
    console.log(list);
    const { header, previewImage, previewVisible } = this.state;
    // 上传icon
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // 上传图片参数
    const payload = {
      type: 2,
    };

    return (
      <PageHeaderLayout>
        <Row>
          <Tag color="blue">首页直播商品背景图，尺寸为750px*460px</Tag>
        </Row>
        <Row style={{ margin: '10px 0' }}>
          <Upload
            action="http://hlsj.test.seastart.cn/admin/upload"
            headers={header}
            listType="picture-card"
            fileList={list}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            data={payload}
            onRemove={this.removeImg}
          >
            {list.length >= 1 ? null : uploadButton}
          </Upload>
        </Row>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Row>
          <Button type="primary" htmlType="submit" loading={loading} onClick={this.handleSubmit}>
            提交
          </Button>
        </Row>
      </PageHeaderLayout>
    );
  }
}
