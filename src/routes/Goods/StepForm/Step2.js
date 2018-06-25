import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Radio,
  Row,
  Col,
  DatePicker,
  Upload,
  Icon,
  Modal,
} from 'antd';
import { routerRedux } from 'dva/router';
// import { digitUppercase } from '../../../utils/utils';
import EditTable from 'components/editTable';
import styles from './style.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formItemLayouts = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const CheckboxGroup = Checkbox.Group;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    payload: {
      type: 2,
    },
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    let { type } = this.props.match.params;
    const { dispatch } = this.props;
    type = type.split(',');
    dispatch({
      type: 'goods/initGoodAttr',
      payload: {
        type: type[0],
        typeSon: type[1],
      },
    });
    // const { dispatch } = this.props;
    dispatch({
      type: 'goods/clearAttrTabe',
    });
  }
  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'goods/clearAttrTabe',
  //   });
  // }
  // onChangeAttr = (index, checkedList) => {
  // const { goods: { initGoodsAttr }, dispatch } = this.props;
  // dispatch({
  //   type: 'goods/checkedList',
  //   payload: {
  //     checkedList,
  //     index,
  //   },
  // });
  //   if (checkedList.length === initGoodsAttr[index].AttrArr.length) {
  //     dispatch({
  //       type: 'goods/checked',
  //       payload: {
  //         index,
  //       },
  //     });
  //   } else if (initGoodsAttr[index].checked) {
  //     dispatch({
  //       type: 'goods/checked',
  //       payload: {
  //         index,
  //       },
  //     });
  //   }
  // }
  onCheckAllAttr = index => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/checked',
      payload: {
        index,
      },
    });
  };
  onChangeSon = (index, checkedList) => {
    // const arr = [];
    // if (initGoodsAttr.length) {
    //   const attrData = initGoodsAttr.filter(res => {
    //     return res.checked
    //   })
    //   this.toGet(arr, {}, 0, attrData);
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/checkedList',
      payload: {
        checkedList,
        index,
      },
    });
  };
  // onCellChange = () => {
  //   console.log(1);
  // }

  handleEmail = event => {
    const { dispatch } = this.props;
    console.log(event);
    dispatch({
      type: 'goods/setAttrTabes',
      payload: {
        attrTable: event,
      },
    });
  };
  changeLevel = (index, key) => {
    // const { dispatch } = this.props;
    console.log(index);
    console.log(key);
    // dispatch({
    //   type: 'goods/setAttrTabes',
    //   payload: {
    //     attrTable: event,
    //   },
    // });
  };
  handleCancelImg = () => this.setState({ previewVisible: false });

  handlePreviewImg = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChangeImg = data => {
    let { fileList } = data;
    fileList = fileList.map(item => {
      if (item.status === 'done' && item.uploaded !== 'done') {
        const img = {};
        img.status = 'done';
        img.uploaded = 'done';
        img.response = { status: 'success' };
        img.name = item.name;
        img.uid = item.uid;
        img.url = item.response.data;
        return img;
      }
      return item;
    });
    this.setState({ fileList });
  };
  customRequest = data => {
    console.log(data);
    const { file } = data;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/uploadImg',
      payload: {
        file,
        type: 2,
      },
    });
  };
  // sucUpload = (e) => {
  //   console.log(e);
  //   const { data } = e;
  //   const { fileList } = this.state;
  //   const img = {};
  //   img.status = 'done';
  //   img.uploaded = 'done';
  //   img.response = { status: 'success' };
  //   img.name = data;
  //   img.uid = data;
  //   img.url = data;
  //   fileList.push(img);
  //   console.log(fileList);
  //   this.setState({ fileList })
  // }
  render() {
    const {
      form,
      dispatch,
      submitting,
      goods: { typeName, initGoodsAttr, attrTable },
    } = this.props;
    const { validateFields, getFieldDecorator } = form;
    // console.log(getFieldValue('goods_name'));
    const { fileList, previewVisible, previewImage, payload, header } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">主体图片</div>
      </div>
    );
    const onPrev = () => {
      dispatch(routerRedux.push('/good/step-form'));
    };
    const attrItem = [];
    const attrItemSon = [];
    initGoodsAttr.forEach((res, index) => {
      attrItem.push(
        <Checkbox onChange={this.onCheckAllAttr.bind(this, index)} key={res.id}>
          {res.name}
        </Checkbox>
      );
      attrItemSon.push(
        <div
          key={index}
          className={`${styles.borderList} ${res.checked ? '' : styles.borderHidden}`}
        >
          <span key={res.id + index} style={{ marginRight: 10 }}>
            {res.name}:
          </span>
          <CheckboxGroup
            rowKey={index => index}
            options={res.AttrArr}
            value={res.checkArr}
            onChange={this.onChangeSon.bind(this, index)}
          />
        </div>
      );
    });

    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          console.log(values);
          console.log(values.goods_shelves_time._d);
          console.log(values.goods_shelves_time._d.getTime());
          // dispatch({
          //   type: 'form/submitStepForm',
          //   payload: {
          //     ...data,
          //     ...values,
          //   },
          // });
        }
      });
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        {typeName}
        <Form.Item {...formItemLayout} label="商品名称">
          {getFieldDecorator('goods_name', {
            rules: [{ required: true, message: '请填写商品名称' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="商品SN">
          {getFieldDecorator('goods_sn', {
            rules: [{ required: true, message: '请填写商品SN' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="列表标题">
          {getFieldDecorator('goods_list_title', {
            rules: [{ required: true, message: '请填写列表标题' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="商品标题">
          {getFieldDecorator('goods_title', {
            rules: [{ required: true, message: '请填写商品标题' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="商品描述">
          {getFieldDecorator('goods_des', {
            rules: [{ required: true, message: '请填写商品描述' }],
          })(<TextArea placeholder="请填写商品描述" autosize />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="销售价格">
          {getFieldDecorator('sell_goods_price', {
            rules: [{ required: true, message: '请填写商品销售价格' }],
          })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="市场价">
          {getFieldDecorator('goods_price', {
            rules: [{ required: true, message: '请填写商品市场价' }],
          })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="商品类型">
          {getFieldDecorator('goods_type', {
            rules: [{ required: true, message: '请填写商品类型' }],
          })(
            <Select>
              <Option value="0">普通商品 </Option>
              <Option value="1">一元购</Option>
              <Option value="2">秒杀</Option>
              <Option value="3">众筹</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="产品总库存">
          {getFieldDecorator('goods_total_inventory', {
            rules: [{ required: true, message: '请填写产品总库存' }],
          })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="是否设置预警">
          {getFieldDecorator('goods_warning_status', {
            rules: [{ required: true, message: '请填写设置预警' }],
          })(
            <RadioGroup>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="预警值">
          {getFieldDecorator('goods_nums_warning', {
            rules: [{ required: true, message: '请填写预警值' }],
          })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="采购地">
          {getFieldDecorator('goods_country_id', {
            rules: [{ required: true, message: '请填写采购地' }],
          })(<Input />)}
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="出货类型">
              {getFieldDecorator('goods_warehouse_type', {
                rules: [{ required: true, message: '请填写出货类型' }],
              })(
                <Select>
                  <Option value="0">仓库发货 </Option>
                  <Option value="1">供应商发货</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="发货仓库">
              {getFieldDecorator('warehouse_id', {
                rules: [{ required: true, message: '请填写发货仓库' }],
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="供应商ID">
              {getFieldDecorator('supplier_id', {
                rules: [{ required: true, message: '请填写供应商ID' }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="运送模板">
              {getFieldDecorator('shop_shipping_type', {
                rules: [{ required: true, message: '请填写运送模板' }],
              })(
                <Select style={{ width: 200 }}>
                  <Option value="0">运费模板 </Option>
                  <Option value="1">固定运费</Option>
                  <Option value="2">包邮</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="快递类型">
              {getFieldDecorator('shop_shipping_calculation_type', {
                rules: [{ required: true, message: '请填写快递类型' }],
              })(
                <Select style={{ width: 200 }}>
                  <Option value="0">快递</Option>
                  <Option value="1">EMS</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="运费价格">
              {getFieldDecorator('shop_shipping_price', {
                rules: [{ required: true, message: '请填写运费价格' }],
              })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="减库存方式">
              {getFieldDecorator('shop_goods_reduced_inventory', {
                rules: [{ required: true, message: '请填写减库存方式' }],
              })(
                <Select style={{ width: 200 }}>
                  <Option value="0">拍下减库存</Option>
                  <Option value="1">付款减库存</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="首页推荐">
              {getFieldDecorator('goods_is_recommend_show', {
                rules: [{ required: true, message: '请填写首页推荐' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="支持7天无理由退货">
              {getFieldDecorator('goods_is_return_server', {
                rules: [{ required: true, message: '请填写是否支持7天无理由退货' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="急速发货">
              {getFieldDecorator('goods_is_fast_delivery', {
                rules: [{ required: true, message: '请填写是否急速发货' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="无忧售后">
              {getFieldDecorator('goods_is_worry_free_sale', {
                rules: [{ required: true, message: '请填写是否无忧售后' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品显示">
              {getFieldDecorator('goods_is_show', {
                rules: [{ required: true, message: '请填写是否商品显示' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="支持退款">
              {getFieldDecorator('goods_is_refund', {
                rules: [{ required: true, message: '请填写是否支持退款' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="支持退货">
              {getFieldDecorator('goods_is_return_goods', {
                rules: [{ required: true, message: '请填写是否支持退货' }],
              })(
                <RadioGroup>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="上架方式">
              {getFieldDecorator('goods_shelves_type', {
                rules: [{ required: true, message: '请填写上架方式' }],
              })(
                <Select>
                  <Option value="1">立即</Option>
                  <Option value="2">时间设定</Option>
                  <Option value="3">放入仓库池</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="上架时间">
              {getFieldDecorator('goods_shelves_time', {
                rules: [{ required: true, message: '请填写商品上架时间' }],
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品状态">
              {getFieldDecorator('goods_status', {
                rules: [{ required: true, message: '请填写商品状态' }],
              })(
                <Select>
                  <Option value="0">上架</Option>
                  <Option value="1">未上架</Option>
                  <Option value="2">下架</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="排序">
              {getFieldDecorator('goods_sort', {
                rules: [{ required: true, message: '请填写商品排序' }],
              })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item {...formItemLayout} label="描述">
          {getFieldDecorator('goods_description', {
            rules: [{ required: true, message: '请填写描述' }],
          })(<TextArea placeholder="请填写描述" autosize />)}
        </Form.Item>
        <div className="clearfix">
          <Upload
            action="http://hlsj.test.seastart.cn/admin/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreviewImg}
            onChange={this.handleChangeImg}
            // onSuccess={this.sucUpload}
            // customRequest={this.customRequest}
            data={payload}
            headers={header}
          >
            {fileList.length >= 6 ? null : uploadButton}
          </Upload>
          <Form.Item {...formItemLayout} label="分拥类型">
            {getFieldDecorator('profit_type', {
              rules: [{ required: true, message: '请填写分拥类型' }],
            })(
              <Select>
                <Option value="0">百分比</Option>
                <Option value="1">数值</Option>
              </Select>
            )}
          </Form.Item>
          <div>分佣值</div>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="一级">
                {getFieldDecorator('level_one', {
                  rules: [{ required: true, message: '请填写一级' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="二级">
                {getFieldDecorator('level_two', {
                  rules: [{ required: true, message: '请填写二级' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="三级">
                {getFieldDecorator('level_three', {
                  rules: [{ required: true, message: '请填写三级' }],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="四级">
                {getFieldDecorator('level_four', {
                  rules: [{ required: true, message: '请填写四级' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="五级">
                {getFieldDecorator('level_five', {
                  rules: [{ required: true, message: '请填写五级' }],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelImg}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
        <div className={styles.borderList}>
          <span>属性名：</span>
          {attrItem}
        </div>
        {attrItemSon}
        <EditTable
          attrTable={attrTable}
          rowKey={index => JSON.stringify(index)}
          handleEmail={this.handleEmail.bind(this)}
          changeLevel={this.changeLevel.bind(this)}
        />
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);
