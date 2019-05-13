import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs } from 'antd';
import moment from 'moment';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import { UPLOAD_TYPE } from '../../utils/config';

// import styles from './TableList.less';

// const { confirm } = Modal;
const TabPane = Tabs.TabPane;

const type = ['', '使用', '转让', '后台操作'];

@connect(({ code, loading }) => ({
  code,
  loading: loading.models.code,
}))
// @Form.create()
export default class Order extends PureComponent {
  state = {
      page: 1,
      tabIndex: 1,
  };
  
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'code/getUserDetail',
      payload: {
        member_id: id,
      },
    });
    dispatch({
        type: 'code/getCodeList',
        payload: {
            member_id: id,
            type: 1,
            page,
            page_number: 10,
        },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'code/clearDetail',
    });
  }
  changeTabs = (e) => {
    const { id } = this.props.match.params;
    this.setState({
      tabIndex: e,
      page: 1,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'code/getCodeList',
      payload: {
        member_id: id,
        type: e,
        page: 1,
        page_number: 10,
      },
    });
}
handleStandardTableChange = (e) => {
    const { id } = this.props.match.params;
    const { current } = e;
    const { dispatch } = this.props;
    this.setState({
      page: current,
    })
    const { tabIndex } = this.state;
    dispatch({
      type: 'code/getCodeList',
      payload: {
        member_id: id,
        type: tabIndex,
        page: current,
        page_number: 10,
      },
    });
  }

  render() {
    const { loading, code: { codeDetail, merchant, group, wealth } } = this.props;
    const progressColumns = [
        {
            title: '时间',
            dataIndex: 'create_time',
            key: 'id',
            render: val => val ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : null,
        },
        {
            title: '说明',
            dataIndex: 'option_type',
            render: val => type[val],
        },
        {
            title: '会员',
            dataIndex: 'user',
            render: val => val ? `${val.nickname}(视群号：${val.fake_id})` : null ,
        },
        {
            title: '数量',
            dataIndex: 'num_change',
            render: (val, record) => val > 0 ? `+${record.num}` : `-${record.num}`,
        },
    ];
    return (
      <PageHeaderLayout>
        <Row>
          <Col span={8}>昵称/姓名：{codeDetail.nickname}</Col>
          <Col span={8}>盟主授权码：{codeDetail.merchant_author_code_num}</Col>
          <Col span={8}>店主授权码：{codeDetail.wealth_author_code_num}</Col>
          <Col span={8}>群主收款码：{codeDetail.group_author_code_num}</Col>
          <Col span={8}>群主待收款码：{codeDetail.payment_code_num}</Col>
          <Col span={8}>创建时间：{moment(codeDetail.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Col>
        </Row>
        <h2>明细</h2>
        <Tabs onChange={this.changeTabs} type="card">
          <TabPane tab="盟主授权码" key="1">
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={merchant}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="店主授权码" key="2">
            {/* <Table
              dataSource={superiorRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={wealth}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
          <TabPane tab="群主授权码" key="3">
            {/* <Table
              dataSource={versionRecord.list}
              rowKey={record => record.id}
              loading={loading}
              columns={progressColumns}
            /> */}
            <StandardTable
              rowKey={record => record.id}
              loading={loading}
              selectedRows={false}
              data={group}
              columns={progressColumns}
              onChange={this.handleStandardTableChange}
            />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
