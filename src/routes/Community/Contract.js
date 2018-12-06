import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
@connect(({ live, loading }) => ({
  live,
  loading: loading.models.live,
}))
@Form.create()
export default class Contract extends PureComponent {
    
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const datas = [{
        id: 1,
        title: '323',
    }];
    const liveListPage = {};
    // const { getFieldDecorator } = this.props.form;
    const progressColumns = [
      {
        title: '直播标题',
        dataIndex: 'title',
        key: 'title',
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form  autoComplete="OFF">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="商品名称">
                    {getFieldDecorator('goods_name')(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} >
                      重置
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            dataSource={datas}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
            pagination={liveListPage}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
