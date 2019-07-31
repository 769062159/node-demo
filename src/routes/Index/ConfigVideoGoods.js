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
  Popconfirm,
  Pagination,
  Input
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ConfigVideoGoods.less';

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
    md: { span: 22 },
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
    addGoodsLoading: false,
    page: 1,
    pagesize: 10,
    total: 0,
    key: ''
  };
  onPaginateChange = (page) => {
    this.setState({
      page: page,
    }, function() {
      this.goodsSearchHandle();
    });
  }
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
    this.goodsSearchHandle();
  };

  handleSearchKey = e => {
    this.setState({
      key: e.target.value
    })
  }

  addGoodsHandle = value =>  {
    this.props.dispatch({
      type: 'config/createVideoGoodsConfig',
      payload: {
        goods_id: value
      },
      callback: () => {
        message.success('添加成功！');
      },
    });
    // this.setState({
    //   addGoodsVisible: false,
    //   goods_id: undefined
    // });
  };
  handleGoodsCancel = () => {
    this.setState({
      addGoodsVisible: false,
      goods_id: undefined
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'config/videoGoodsConfig',
    });
    dispatch({
      type: 'config/videoGoodsConfigPower',
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
    values.goods_name = this.state.key;
    values.page = this.state.page;
    values.page_number = this.state.pagesize;
    this.props.dispatch({
      type: 'goods/fetchGoods',
      payload: values
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
    const { loading, form, config: { videoGoodsList, videoGoodsPower }, goods: {goodsList, goodsListPage}  } = this.props;


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
              width={600}
              title={`添加商品`}
              visible={this.state.addGoodsVisible}
              onCancel={this.handleGoodsCancel.bind(this)}
              footer={[
              ]}
            >
              <Input value={this.state.key} onChange={this.handleSearchKey} onPressEnter={this.goodsSearchHandle} placeholder="输入关键词，回车搜索"/>
              <Row gutter={16} className={styles.RowStyleBox}>
                {goodsList.map(item =>
                  <Col  md={8} key={item.goods_id}>
                    <div className={styles.showGoods}>
                      <div className={styles.cover}>
                        <img src={item.img}  />
                      </div>
                      <div className={styles.content}>
                        <div className={styles.name}>
                          {item.goods_name}
                        </div>
                        <div className={styles.price}>
                          售价：￥{item.sell_goods_price}
                        </div>
                      </div>
                      <div className={styles.action}>
                      <Popconfirm title="是否添加该商品？" onConfirm={() => this.addGoodsHandle(item.goods_id)} okText="是" cancelText="否">
                        <Icon type="check" />
                      </Popconfirm>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
              <Pagination page={goodsListPage.current} pageSize={goodsListPage.pageSize} onChange={this.onPaginateChange} total={goodsListPage.total} />
            </Modal>
            <br />
            <Row gutter={16}>
              {videoGoodsList.map(item =>
                <Col sm={12} xs={24} md={12} lg={12} xl={8} xxl={4} key={item.id}>
                  <div className={styles.chooseGoods}>
                    <div className={styles.cover}>
                      <img src={item.goods.img}  />
                    </div>
                    <div className={styles.content}>
                      <div className={styles.name}>
                        {item.goods.name}
                      </div>
                      <div className={styles.price}>
                        售价：￥{item.goods.price}
                      </div>
                    </div>
                    <div className={styles.action}>
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
