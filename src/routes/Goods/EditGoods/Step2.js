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
  Card,
  message,
} from 'antd';
import moment from 'moment';
// import { routerRedux } from 'dva/router';
import ReactEditor from 'components/ReactEditor';
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
const formItemLayoutUploadImg = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
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
    payload: {
      type: 2,
    },
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/initGoodAttr',
      payload: {
        goods_id: id,
      },
    });
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
  setDescription = e => {
    // const { form } = this.props;
    // const { setFieldsValue } = form;
    if (e === '<p></p>') {
      // setFieldsValue({'goods_description': ''});
      this.chgFormVal('goods_description', '');
    } else {
      // setFieldsValue({'goods_description': e});
      this.chgFormVal('goods_description', e);
    }
  };
  // 修改表单内的值
  chgFormVal = (key, value) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    const obj = {};
    obj[key] = value;
    setFieldsValue(obj);
  };
  modifiedValue = event => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/setAttrTabes',
      payload: {
        attrTable: event,
      },
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/setGoodsImg',
      payload: {
        fileList,
      },
    });
    // this.setState({ fileList });
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
  chgLevelHas = (index, e) => {
    const { dispatch, goods: { typePartial, totalPrice } } = this.props;
    if (typePartial === '0' && !totalPrice) {
      message.error('请填写销售价格！');
    } else {
      dispatch({
        type: 'goods/setLevelPartial',
        payload: {
          index,
          value: e,
        },
      });
    }
    // else if (totalPrice){
    //   console.log(totalPrice)
    //   console.log(e)
    //   e = Number((totalPrice * e / 100).toFixed(2));
    //   dispatch({
    //     type: 'goods/setLevelPartial',
    //     payload: {
    //       index,
    //       value: e,
    //     },
    //   });
    // }
  };
  chgTypeHas(e) {
    const { dispatch } = this.props;
    // this.chgFormVal('level_0', '');
    dispatch({
      type: 'goods/changeTypePartial',
      payload: {
        e,
      },
    });
  }
  // 修改总价
  chgTotalProce(e) {
    console.log(e);
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/changeTotalPrice',
      payload: {
        e,
      },
    });
  }
  // 修改总库存
  chgTotalStock(e) {
    console.log(e);
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/changeTotalStock',
      payload: {
        e,
      },
    });
  }

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
      goods: {
        typeName,
        initGoodsAttr,
        attrTable,
        typePartial,
        levelPartial,
        levelPartialSon,
        goodsPlace,
        brandList,
        totalPrice,
        totalStock,
        goodsDetail,
        uploadGoodsImg,
      },
    } = this.props;
    const goodsPlaceItem = [];
    goodsPlace.forEach(res => {
      goodsPlaceItem.push(
        <Option key={res.place_id} value={res.place_id}>
          {res.place_name}
        </Option>
      );
    });
    const brandListItem = [];
    brandList.forEach(res => {
      brandListItem.push(
        <Option key={res.brand_id} value={res.brand_id}>
          {res.brand_name}
        </Option>
      );
    });
    // const typePartials = typePartial.toString();
    const { validateFields, getFieldDecorator } = form;
    // if (Object.keys(goodsDetail).length) {
    //   const formData = {
    //     'goods_name': 222,
    //   };
    //   setFieldsValue(formData);
    // }
    // console.log(getFieldValue('goods_name'));
    const { previewVisible, previewImage, payload, header } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">主体图片</div>
      </div>
    );
    const attrItem = [];
    const attrItemSon = [];
    initGoodsAttr.forEach((res, index) => {
      attrItem.push(
        <Checkbox
          onChange={this.onCheckAllAttr.bind(this, index)}
          checked={res.checked}
          key={res.id}
        >
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
      console.log(attrTable);
      validateFields((err, values) => {
        console.log(values);
        if (!err) {
          const { goods: { uploadGoodsImg } } = this.props;
          if (!uploadGoodsImg.length) {
            message.error('请上传图片主体！');
            return;
          }
          const { goods: { attrTable, levelPartial, typePartial, goodsDetail } } = this.props;
          attrTable.forEach(ele => {
            if (!ele.fileList.length) {
              ele.img = '';
            } else {
              ele.img = ele.fileList[0].url;
            }
            const arr = [];
            ele.profit.forEach(res => {
              arr.push({
                price: res,
              });
            });
            levelPartial.forEach((res, index) => {
              arr[index].profit_value = res;
            });
            ele.profit = arr;
          });
          values.class_id = goodsDetail.class_id;
          values.category_id = goodsDetail.category_id;
          values.goods_id = goodsDetail.goods_id;
          values.goods_img = [];
          uploadGoodsImg.forEach(res => {
            values.goods_img.push(res.url);
          });
          values.profit_value = levelPartial;
          values.goods_sku = attrTable;
          values.profit_type = typePartial;
          values.goods_shelves_time = values.goods_shelves_time._d.getTime();
          console.log(values);
          // console.log(values.goods_shelves_time._d);
          // console.log(values.goods_shelves_time._d.getTime());
          dispatch({
            type: 'goods/addShop',
            payload: {
              ...values,
            },
          });
        }
      });
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Card title="商品信息">
          {/* <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="主体图片" >
                <span style={{color: 'red'}}>图片最多5张</span>
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品类别">
                <span>{typeName}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品名称">
                {getFieldDecorator('goods_name', {
                  initialValue: goodsDetail.goods_name,
                  rules: [{ required: true, message: '请填写商品名称' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品SN">
                {getFieldDecorator('goods_sn', {
                  initialValue: goodsDetail.goods_sn,
                  rules: [{ required: true, message: '请填写商品SN' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品品牌">
                {getFieldDecorator('brand_id', {
                  initialValue: goodsDetail.brand_id || '',
                  rules: [{ required: true, message: '请填写商品品牌' }],
                })(<Select>{brandListItem}</Select>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="列表标题">
                {getFieldDecorator('goods_list_title', {
                  initialValue: goodsDetail.goods_list_title,
                  rules: [{ required: true, message: '请填写列表标题' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品标题">
                {getFieldDecorator('goods_title', {
                  initialValue: goodsDetail.goods_title,
                  rules: [{ required: true, message: '请填写商品标题' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品描述">
                {getFieldDecorator('goods_des', {
                  initialValue: goodsDetail.goods_des,
                  rules: [{ required: true, message: '请填写商品描述' }],
                })(<TextArea placeholder="请填写商品描述" autosize />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="销售价格">
                {getFieldDecorator('sell_goods_price', {
                  initialValue: goodsDetail.sell_goods_price,
                  rules: [{ required: true, message: '请填写商品销售价格' }],
                })(
                  <InputNumber
                    onChange={e => this.chgTotalProce(e)}
                    step={0.01}
                    precision={2}
                    min={0.01}
                    style={{ width: '200px' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="市场价">
                {getFieldDecorator('goods_price', {
                  initialValue: goodsDetail.goods_price,
                  rules: [{ required: true, message: '请填写商品市场价' }],
                })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品类型">
                {getFieldDecorator('goods_type', {
                  initialValue: (goodsDetail.goods_type || 0).toString(),
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
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="产品总库存">
                {getFieldDecorator('goods_total_inventory', {
                  initialValue: goodsDetail.goods_total_inventory,
                  rules: [{ required: true, message: '请填写产品总库存' }],
                })(
                  <InputNumber
                    step={1}
                    min={1}
                    onChange={e => this.chgTotalStock(e)}
                    style={{ width: '200px' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="商品状态">
                {getFieldDecorator('goods_status', {
                  initialValue: (goodsDetail.goods_status || 0).toString(),
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
                  initialValue: goodsDetail.goods_sort,
                  rules: [{ required: true, message: '请填写商品排序' }],
                })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item {...formItemLayoutUploadImg} label="主体图片">
                {getFieldDecorator('xxx', {
                  initialValue: 11,
                  rules: [{ required: true, message: '请填写商品排序' }],
                })(
                  <div className="clearfix">
                    <Upload
                      action="http://hlsj.test.seastart.cn/admin/upload"
                      listType="picture-card"
                      fileList={uploadGoodsImg}
                      onPreview={this.handlePreviewImg}
                      onChange={this.handleChangeImg}
                      // onSuccess={this.sucUpload}
                      // customRequest={this.customRequest}
                      data={payload}
                      headers={header}
                    >
                      {uploadGoodsImg.length >= 6 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelImg}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card>
          <Form.Item {...formItemLayout} label="是否设置预警">
            {getFieldDecorator('goods_warning_status', {
              initialValue: goodsDetail.goods_warning_status,
              rules: [{ required: true, message: '请填写设置预警' }],
            })(
              <RadioGroup>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="预警值">
                {getFieldDecorator('goods_nums_warning', {
                  initialValue: goodsDetail.goods_nums_warning,
                  rules: [{ required: true, message: '请填写预警值' }],
                })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="采购地">
                {getFieldDecorator('goods_country_id', {
                  initialValue: goodsDetail.goods_country_id,
                  rules: [{ required: true, message: '请填写采购地' }],
                })(<Select>{goodsPlaceItem}</Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="出货类型">
                {getFieldDecorator('goods_warehouse_type', {
                  initialValue: (goodsDetail.goods_warehouse_type || 0).toString(),
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
                  initialValue: goodsDetail.warehouse_id,
                  rules: [{ required: true, message: '请填写发货仓库' }],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="供应商ID">
                {getFieldDecorator('supplier_id', {
                  initialValue: goodsDetail.supplier_id,
                  rules: [{ required: true, message: '请填写供应商ID' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="运送模板">
                {getFieldDecorator('shop_shipping_type', {
                  initialValue: (goodsDetail.shop_shipping_type || 0).toString(),
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
                  initialValue: (goodsDetail.shop_shipping_calculation_type || 0).toString(),
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
                  initialValue: goodsDetail.shop_shipping_price,
                  rules: [{ required: true, message: '请填写运费价格' }],
                })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="减库存方式">
                {getFieldDecorator('shop_goods_reduced_inventory', {
                  initialValue: (goodsDetail.shop_goods_reduced_inventory || 0).toString(),
                  rules: [{ required: true, message: '请填写减库存方式' }],
                })(
                  <Select style={{ width: 200 }}>
                    <Option value="0">拍下减库存</Option>
                    <Option value="1">付款减库存</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="上架方式">
                {getFieldDecorator('goods_shelves_type', {
                  initialValue: (goodsDetail.goods_shelves_type || '').toString(),
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
                  initialValue: moment(goodsDetail.goods_shelves_time, 'YYYY-MM-DD HH:mm:ss'),
                  rules: [{ required: true, message: '请填写商品上架时间' }],
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述">
            {getFieldDecorator('goods_description', {
              initialValue: goodsDetail.goods_description,
              rules: [{ required: true, message: '请填写描述' }],
            })(
              <ReactEditor
                setDescription={this.setDescription}
                valueSon={goodsDetail.goods_description}
              />
            )}
          </Form.Item>
        </Card>
        <Card>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formItemLayouts} label="无忧售后">
                {getFieldDecorator('goods_is_worry_free_sale', {
                  initialValue: goodsDetail.goods_is_worry_free_sale,
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
                  initialValue: goodsDetail.goods_is_show,
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
                  initialValue: goodsDetail.goods_is_refund,
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
                  initialValue: goodsDetail.goods_is_return_goods,
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
              <Form.Item {...formItemLayouts} label="支持7天无理由退货">
                {getFieldDecorator('goods_is_return_server', {
                  initialValue: goodsDetail.goods_is_return_server,
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
                  initialValue: goodsDetail.goods_is_fast_delivery,
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
              <Form.Item {...formItemLayouts} label="首页推荐">
                {getFieldDecorator('goods_is_recommend_show', {
                  initialValue: goodsDetail.goods_is_recommend_show,
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
        </Card>
        <Card title="sku分佣">
          <Form.Item {...formItemLayout} label="分佣类型">
            {getFieldDecorator('profit_type', {
              initialValue: typePartial,
              rules: [{ required: true, message: '请填写分佣类型' }],
            })(
              <Select onChange={e => this.chgTypeHas(e)}>
                <Option value="0">百分比</Option>
                <Option value="1">数值</Option>
              </Select>
            )}
          </Form.Item>
          <div>分佣值</div>
          <Row gutter={24}>
            <Col span={8}>
              {/* {totalPrice} */}
              <Form.Item {...formItemLayouts} label="一级">
                {getFieldDecorator('level_0', {
                  initialValue: levelPartial[0],
                  rules: [{ required: true, message: '请填写一级' }],
                })(
                  typePartial === '0' ? (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${totalPrice ? value : 0}%`}
                      parser={value => value.replace('%', '')}
                      onChange={e => this.chgLevelHas(0, e)}
                    />
                  ) : (
                    <InputNumber
                      step={0.01}
                      precision={2}
                      min={0.01}
                      onChange={e => this.chgLevelHas(0, e)}
                    />
                  )
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="二级">
                {getFieldDecorator('level_1', {
                  initialValue: levelPartial[1],
                  rules: [{ required: true, message: '请填写二级' }],
                })(
                  typePartial === '0' ? (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${totalPrice ? value : 0}%`}
                      parser={value => value.replace('%', '')}
                      onChange={e => this.chgLevelHas(1, e)}
                    />
                  ) : (
                    <InputNumber
                      step={0.01}
                      precision={2}
                      min={0.01}
                      onChange={e => this.chgLevelHas(1, e)}
                    />
                  )
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="三级">
                {getFieldDecorator('level_2', {
                  initialValue: levelPartial[2],
                  rules: [{ required: true, message: '请填写三级' }],
                })(
                  typePartial === '0' ? (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${totalPrice ? value : 0}%`}
                      parser={value => value.replace('%', '')}
                      onChange={e => this.chgLevelHas(2, e)}
                    />
                  ) : (
                    <InputNumber
                      step={0.01}
                      precision={2}
                      min={0.01}
                      onChange={e => this.chgLevelHas(2, e)}
                    />
                  )
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="四级">
                {getFieldDecorator('level_3', {
                  initialValue: levelPartial[3],
                  rules: [{ required: true, message: '请填写四级' }],
                })(
                  typePartial === '0' ? (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${totalPrice ? value : 0}%`}
                      parser={value => value.replace('%', '')}
                      onChange={e => this.chgLevelHas(3, e)}
                    />
                  ) : (
                    <InputNumber
                      step={0.01}
                      precision={2}
                      min={0.01}
                      onChange={e => this.chgLevelHas(3, e)}
                    />
                  )
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayouts} label="五级">
                {getFieldDecorator('level_4', {
                  initialValue: levelPartial[4],
                  rules: [{ required: true, message: '请填写五级' }],
                })(
                  typePartial === '0' ? (
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={value => `${totalPrice ? value : 0}%`}
                      parser={value => value.replace('%', '')}
                      onChange={e => this.chgLevelHas(4, e)}
                    />
                  ) : (
                    <InputNumber
                      step={0.01}
                      precision={2}
                      min={0.01}
                      onChange={e => this.chgLevelHas(4, e)}
                    />
                  )
                )}
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.borderList}>
            <span>属性名：</span>
            {attrItem}
          </div>
          {attrItemSon}
          <EditTable
            attrTable={attrTable}
            totalPrice={totalPrice}
            totalStock={totalStock}
            levelPartialSon={levelPartialSon}
            rowKey={index => JSON.stringify(index)}
            modifiedValue={this.modifiedValue.bind(this)}
          />
        </Card>
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
          {/* <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button> */}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);