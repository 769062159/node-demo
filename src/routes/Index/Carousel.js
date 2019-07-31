import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Table, message, Modal, Card, Button, Divider, Row, Col, Checkbox } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { confirm } = Modal;
const jumpType = ['', '跳转商品', '跳转外部链接', '无跳转', '跳转直播间', '跳转录播'];

@connect(({ indexs, loading }) => ({
  indexs,
  loading: loading.models.indexs,
}))
export default class Home extends PureComponent {
  state = {
    // expandForm: false,
    bindFormId: '',
    // homeVisible: false,
    pagination: 1, // 页脚
    // page: 1, // 商品页脚
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'indexs/fetchHome',
      payload: {
        page: pagination,
        type: 3,
      },
    });

  }


  getBindId = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/bindProgramId',
      payload: e,
    });
  }

  // 删除商品
  deleteDataMsg = id => {
    event.preventDefault();
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        const { pagination } = that.state;
        dispatch({
          type: 'indexs/deleteHome',
          payload: {
            id,
            type: 3,
            page: pagination,
          },
        });
      },
      onCancel() {
      },
    });
  };
  // 新增修改提交
  handleSubmit = () => {
    const { dispatch, indexs: { homeForm, uploadHomeImg, homeGoods, homeLive } } = this.props;
    if (!uploadHomeImg.length) {
      message.error('请上传封面');
      return;
    }
    const { pagination } = this.state;
    if (homeForm.jump_type === 1) {
      homeForm.remark = homeGoods.label;
      homeForm.target_id = homeGoods.key;
    } else if (homeForm.jump_type === 4) {
      homeForm.target_name = homeGoods.label;
      homeForm.target_id = homeGoods.key;
      homeForm.remark = homeLive.label;
      homeForm.live_id = homeLive.key;
    } else {
      homeForm.remark = '';
      homeForm.target_id = '';
    }
    homeForm.page = pagination;
    homeForm.cover = uploadHomeImg[0].url;
    if (homeForm.id) {
      dispatch({
        type: 'indexs/editHome',
        payload: homeForm,
      });
      message.success('修改成功');
    } else {
      dispatch({
        type: 'indexs/addHome',
        payload: homeForm,
      });
      message.success('添加成功');
    }
    this.handAddleCancel();
  };
  // 修改信息
  editDataMsg = (data, e) => {
    e.preventDefault();
    this.showModal();
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/editHomeMsgs',
      payload: {
        data,
      },
    });
  };

  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'indexs/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
    const { current } = pagination;
    this.setState({
      pagination: current,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchHome',
      payload: {
        page: current,
      },
    });
  };
  bindProgram = (id) => {
    this.setState({
      bindFormId: id,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/getBanner',
      payload: {
        index_id: id,
      },
    });
  }
  bindProgramId = () => {
    const { bindFormId } = this.state;
    const { indexs: { checkProgramList }, dispatch } = this.props;
    dispatch({
      type: 'indexs/bindBanner',
      payload: {
        index_id: bindFormId,
        wechat_account_ids: checkProgramList,
      },
      callback: () => {
        this.setState({
          bindFormId: '',
        })
        message.success('设置成功');
      },
    });
  }
  cancelProgram = () => {
    this.setState({
      bindFormId: '',
    })
  }
  goodListChange = pagination => {
    const { current } = pagination;
    // this.setState({
    //   pagination: current,
    // });
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
        page: current,
        page_number: 10,
      },
    });
  };
  goPath = index => {
    const { dispatch } = this.props;
    const url = `/market/AddForm/${index}`;
    dispatch(routerRedux.push(url));
  };

  render() {
    const {
      indexs: { homeList: datas, homeListPage, programList, checkProgramList },
      loading,
    } = this.props;

    const { bindFormId } = this.state;
    const progressColumns = [
      {
        title: '封面',
        dataIndex: 'cover',
        render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
      },
      {
        title: '跳转类型',
        dataIndex: 'jump_type',
        render: val => jumpType[val],
      },
      {
        title: '跳转关联',
        dataIndex: 'target_name',
      },
      {
        title: '排序',
        dataIndex: 'sort',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        // fixed: 'right',
        // width: 150,
        render: (text, record) => (
          <Fragment>
            <a href={`#/market/EditForm/${record.id}`}>修改</a>
            <Divider type="vertical" />
            <a onClick={this.bindProgram.bind(this, record.id)}>小程序展示</a>
            <Divider type="vertical" />
            <a onClick={this.deleteDataMsg.bind(this, record.id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const programListArr = [];
    if (programList.length) {
      programList.forEach(res => {
        programListArr.push(
          <Col span={8} key={res.id}><Checkbox value={res.id} >{res.name}</Checkbox></Col>
        );
      });
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.goPath.bind(this, 3)}>
                新建
              </Button>
            </div>
            <Table
              onChange={this.handleTableChange}
              dataSource={datas}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
              pagination={homeListPage}
            />
          </div>
        </Card>
        <Modal
          title="小程序展示"
          visible={!!bindFormId}
          onOk={this.bindProgramId}
          onCancel={this.cancelProgram.bind(this)}
        >
          <Row>
            <Col span={24}>
              <Checkbox.Group style={{ width: '100%' }} value={checkProgramList} onChange={this.getBindId}>
                <Row>
                  {programListArr}
                </Row>
              </Checkbox.Group>
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
