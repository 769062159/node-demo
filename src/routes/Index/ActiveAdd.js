import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, Upload, Icon, Tag, message, Card, Select, Table, InputNumber } from 'antd';
import styles from './Style.less';
import { UPLOAD_TYPE } from '../../utils/config';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const arr = {
      pic: Form.createFormField({
        value: props.activeForm.pic,
      }),
      type: Form.createFormField({
        value: props.activeForm.type,
      }),
      sort: Form.createFormField({
        value: props.activeForm.sort,
      }),
    };
    return arr;
  },
})(props => {
  //  111
  const { getFieldDecorator, validateFields } = props.form;
  const {
    uploadUrl,
    activeForm,
    header,
    loading,
    GoodList,
    GoodListPage,
    goodListChange,
    goodSelect,
    GoodKey,
  } = props;
  const goodListColumns = [
    {
      title: '商品名',
      dataIndex: 'goods_name',
      width: 200,
      key: 'goods_name',
    },
    {
      title: '封面',
      dataIndex: 'img',
      render: val => (val ? <img src={val} style={{ width: '80px' }} alt="图片" /> : null),
    },
    {
      title: '价格',
      dataIndex: 'goods_price',
    },
    {
      title: '库存',
      dataIndex: 'goods_total_inventory',
    },
  ];
  const onValidateForm = e => {
    e.preventDefault();
    const { submitForm } = props;
    validateFields((err, values) => {
      if (!err) {
        submitForm(values);
      } else {
        message.error('请填写信息');
      }
    });
  };
  // 上传按钮
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">图片</div>
    </div>
  );
  // 上传图片参数
  const payload = {
    type: UPLOAD_TYPE.active,
  };
  //  限制大小
  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片不能超过1M!');
    }
    return isLt1M;
  }
  return (
    <Form autoComplete="OFF">
      <FormItem {...formItemLayout} label="跳转类型">
        {getFieldDecorator('type', {
            rules: [
            {
                required: true,
                message: '请输入跳转类型',
            },
            ],
        })(
          <Select style={{ width: 200 }}>
            <Option value={1}>跳转商品</Option>
            <Option value={0}>不跳转</Option>
          </Select>
        )}
      </FormItem>
      {
        activeForm.type ? (
          <FormItem {...formItemLayout} label="商品列表" className={styles.tableHeaders}>
            <Table
              style={{ width: 600 }}
              onChange={goodListChange}
              // onSelect={goodSelect}
              dataSource={GoodList}
              rowSelection={{ type: 'radio', onSelect: goodSelect, selectedRowKeys: GoodKey }}
              rowKey={record => record.goods_id}
              loading={loading}
              columns={goodListColumns}
              pagination={GoodListPage}
            />
          </FormItem>
        ) : null
      }
      <FormItem {...formItemLayout} label="排序">
        {getFieldDecorator('sort', {
            rules: [
            {
                required: true,
                message: '请输入排序',
            },
            ],
        })(
          <InputNumber />
        )}
      </FormItem>
      <Form.Item
        className={styles.extraTag}
        {...formItemLayout}
        label="活动图"
        extra={<Tag color="blue">大小不得大于1M</Tag>}
      >
        {getFieldDecorator('pic', {
          valuePropName: 'fileList',
          getValueFromEvent(...args) {
            const { fileList, file } = args[0];
            if (!file.status) {
              const list = fileList.filter(res => {
                return res.uid !== file.uid;
              });
              return list;
            }
            return fileList;
          },
          rules: [{ required: true }],
        })(
          <Upload
            action={uploadUrl}
            beforeUpload={beforeUpload}
            listType="picture-card"
            data={payload}
            headers={header}
          >
            {activeForm.pic.length ? null : uploadButton}
          </Upload>
        )}
      </Form.Item>
      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
        <Button type="primary" loading={loading} htmlType="submit" onClick={onValidateForm}>
          提交
        </Button>
      </FormItem>
    </Form>
  );
});

@connect(({ indexs, loading }) => ({
  indexs,
  loading: loading.models.indexs,
}))
export default class ActiveAdd extends React.PureComponent {
  state = {
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
        type: 'indexs/fetchGoodList',
        payload: {
          page: 1,
          page_number: 5,
        },
    });
    if (id) {
      dispatch({
        type: 'indexs/activeDetail',
        payload: {
          landpage_id: id,
        },
      })
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/clearDeail',
    })
  }

  // 新增修改提交
  submitForm = () => {
    const { indexs: { activeForm, GoodKey }, dispatch } = this.props;
    if (activeForm.type && !GoodKey.length) {
        message.error('请选择商品');
        return false;
    };
    const data = {
        type: activeForm.type,
        goods_id: GoodKey[0],
        http_url: activeForm.pic[0].response.data,
        sort: activeForm.sort,
    }
    const { id } = this.props.match.params;
    if (!id) {
      dispatch({
        type: 'indexs/setActivePage',
        payload: data,
        callback: () => {
          message.success('设置成功');
          const url = `/market/active`;
          dispatch(routerRedux.push(url));
        },
      });
    } else {
      data.landpage_id = id;
      dispatch({
        type: 'indexs/editActiveDetail',
        payload: data,
        callback: () => {
          message.success('设置成功');
          const url = `/market/active`;
          dispatch(routerRedux.push(url));
        },
      });
      console.log('没有id');
    }
  };
  // 商品
  goodListChange = pagination => {
    const { current } = pagination;
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/fetchGoodList',
      payload: {
        page: current,
        page_number: 5,
      },
    });
  };
  goodSelect = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexs/selectGood',
      payload: {
        data: record,
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
      type: 'indexs/changeActiveFormVal',
      payload: {
        obj,
      },
    });
  };
  render() {
    const { uploadUrl, indexs: { activeForm, GoodList, GoodListPage, GoodKey }, loading } = this.props;
    const { header } = this.state;
    return (
      <div>
        <Card>
          <CustomizedForm
            goodListChange={this.goodListChange}
            GoodList={GoodList}
            GoodListPage={GoodListPage}
            GoodKey={GoodKey}
            goodSelect={this.goodSelect}
            activeForm={activeForm}
            uploadUrl={uploadUrl}
            onChange={this.changeFormVal}
            header={header}
            submitForm={this.submitForm}
            loading={loading}
          />
        </Card>
      </div>
    );
  }
}
