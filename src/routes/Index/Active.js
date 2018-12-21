import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Button,
    Table,
    message,
    Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { confirm } = Modal;
const jumpType = ['不跳转', '跳转商品'];

@connect(({ indexs, loading }) => ({
    indexs,
    loading: loading.models.indexs,
}))
export default class Active extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'indexs/getActiveList',
        });
    }
    // 删除商品
    deleteItem = id => {
        event.preventDefault();
        const that = this;
        confirm({
        content: '你确定删除这个吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            const { dispatch } = that.props;
            dispatch({
                type: 'indexs/delActive',
                payload: id,
                callback: () => {
                    message.success('删除成功！');
                },
            });
        },
        onCancel() {
            console.log('Cancel');
        },
        });
    };
    render() {
        const { indexs: { activeList: datas }, loading } = this.props;
    
        const columns = [
          {
            title: '跳转类型',
            dataIndex: 'type',
            key: 'type',
            render: val => jumpType[val],
          },
          {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
          },
          {
            title: '活动图',
            dataIndex: 'http_url',
            key: 'http_url',
            render: (val) => <img style={{ height: 80, width: 80 }} src={val} alt="商品" />,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 150,
            render: record => (
              <Fragment>
                <a onClick={this.deleteItem.bind(this, record.id)}>删除</a>
              </Fragment>
            ),
          },
        ];
    
        return (
          <PageHeaderLayout>
            <Card bordered={false} >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <a href="#/market/activ-add">
                    <Button icon="plus" type="primary" >
                        新建
                    </Button>
                  </a>
                </div>
                <Table
                  rowKey={record => record.id}
                  dataSource={datas}
                  loading={loading}
                  columns={columns}
                />
              </div>
            </Card>
          </PageHeaderLayout>
        );
    }
}