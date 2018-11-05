import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  Row,
  Form,
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
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'config/fetchConfig',
    });
  }

  render() {
    const { loading } = this.props;
    // const { header, previewImage, previewVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Row>
          <Button type="primary" htmlType="submit" loading={loading} onClick={this.handleSubmit}>
            提交
          </Button>
        </Row>
      </PageHeaderLayout>
    );
  }
}
