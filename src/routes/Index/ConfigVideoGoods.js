import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Form,
  Button,
  Switch,
  Modal,
  Select,
  message,
  Row,
  Col,
  Icon,
  Popconfirm
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ config, goods, loading }) => ({
  config,
  goods,
  loading: loading.models.config,
}))
@Form.create()
export default class VideoGoodsConfig extends PureComponent {
  state = {
    addGoodsVisible: false,
    goods_id: undefined,
    addGoodsLoading: false
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/videoGoodsConfig',
    });
    dispatch({
      type: 'config/videoGoodsConfigPower',
    });
  }
  onChange = power => {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/setVideoGoodsConfigPower',
      payload: {
        power: power ? 1 : 0
      },
      callback: () => {
        message.success(`设置成功`);
      },
    });
  };

  addGoods = value =>  {
    this.setState({
      addGoodsVisible: true
    })
  };

  addGoodsHandle = value =>  {
    this.props.dispatch({
      type: 'config/createVideoGoodsConfig',
      payload: {
        goods_id: this.state.goods_id
      },
      callback: () => {
        message.success('添加成功！');
      },
    });
    this.setState({
      addGoodsVisible: false,
      goods_id: undefined
    });
  };
  handleGoodsCancel = () => {
    this.setState({
      addGoodsVisible: false,
      goods_id: undefined
    });
  };

  removeGoodsHandle = value => {
    this.props.dispatch({
      type: 'config/deleteVideoGoodsConfig',
      payload: {
        id: value
      },
      callback: () => {
        message.success('取消成功！');
      },
    });
  };

  goodsSearchHandle = value => {
    let values = {};
    values.goods_name = value;
    this.props.dispatch({
      type: 'goods/fetchGoods',
      payload: values,
    });
  };
  goodsChangeHandle = value => {
    this.setState({
      goods_id: value
    });
  }
  
  handleSubmit =  e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (!err) {
        const { dispatch } = this.props;
        value.user_ids = value.user_ids.toString();
        dispatch({
          type: 'config/saveCardConfig',
          payload: value,
          callback: () => {
            message.success(`设置成功`);
          },
        });
      }
    });
  };
  render() {
    const { loading, form, config: { videoGoodsList, videoGoodsPower }, goods: {goodsList}  } = this.props;
    const { getFieldDecorator } = form;
    const options = goodsList.map(d => <Option key={d.goods_id}>{d.goods_name}</Option>)


    // const { header, previewImage, previewVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Form>
          <FormItem {...formItemLayout} label="随机关联商品">
            <Switch onChange={this.onChange} checked={videoGoodsPower}/>
          </FormItem>

          <FormItem {...formItemLayout} label="关联商品列表">
            <Button type="primary" onClick={this.addGoods}>添加商品</Button>
            <Modal
              title="添加商品"
              visible={this.state.addGoodsVisible}
              onCancel={this.handleGoodsCancel.bind(this)}
              footer={[
                <Button key="submit" type="primary" loading={this.state.addGoodsLoading} onClick={this.addGoodsHandle}>
                  添加
                </Button>
              ]}
            >
            <Select
              style={{ width: '100%' }}
              showSearch
              value={this.state.goods_id}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.goodsSearchHandle}
              onChange={this.goodsChangeHandle}
              notFoundContent={null}
            >
              {options}
            </Select>
            </Modal>
            <br />
            <Row gutter={16}>
              {videoGoodsList.map(item =>
                <Col sm={10}>
                  <div style={{width: '100%', background: '#fff', borderRadius: '8px', height: '120px', display: 'flex', flexDirection: 'row', padding: '10px 5px', margin: '10px'}}>
                    <div style={{height: '100px', width: '100px', marginRight: '5px'}}>
                      <img src={item.goods.img} style={{height: '100%', width: '100%'}}/>
                    </div>
                    <div style={{ width: 'calc(100% - 100px)' }}>
                      <div style={{ height: '60px', lineHeight: '20px', overflow: 'hidden'}}>
                        {item.goods.name}
                      </div>
                      <div style={{ height: '30px', lineHeight: '30px', marginTop: '10px'}}>
                        售价：￥{item.goods.price}
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: '0', right: '-10px', height: '30px', lineHeight: '30px', width: '30px', textAlign: 'center', background: '#666', color: '#fff', borderRadius: '50%', border: '1px solid rgba(240, 240, 240, .8)', cursor: 'pointer'}}>
                    <Popconfirm title="确定取消这个默认商品的设置吗？" onConfirm={() => this.removeGoodsHandle(item.id)} okText="是" cancelText="否">
                      <Icon type="close" />
                    </Popconfirm>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </FormItem>
        </Form>
      </PageHeaderLayout>
    );
  }
}
