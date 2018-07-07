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

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    console.log(props);
    const { goods: { goodsDetail, systemType } } = props;
    const arr = {
      goods_name: Form.createFormField({
        value: goodsDetail.goods_name,
      }),
      goods_sn: Form.createFormField({
        value: goodsDetail.goods_sn,
      }),
      goods_list_title: Form.createFormField({
        value: goodsDetail.goods_list_title,
      }),
      weight: Form.createFormField({
        value: goodsDetail.weight,
      }),
      goods_des: Form.createFormField({
        value: goodsDetail.goods_des,
      }),
      brand_id: Form.createFormField({
        value: goodsDetail.brand_id,
      }),
      goods_title: Form.createFormField({
        value: goodsDetail.goods_title,
      }),
      sell_goods_price: Form.createFormField({
        value: goodsDetail.sell_goods_price,
      }),
      goods_price: Form.createFormField({
        value: goodsDetail.goods_price,
      }),
      goods_type: Form.createFormField({
        value: goodsDetail.goods_type,
      }),
      goods_total_inventory: Form.createFormField({
        value: goodsDetail.goods_total_inventory,
      }),
      goods_status: Form.createFormField({
        value: goodsDetail.goods_status,
      }),
      goods_sort: Form.createFormField({
        value: goodsDetail.goods_sort,
      }),
      cost_price: Form.createFormField({
        value: goodsDetail.cost_price,
      }),
      xxx: Form.createFormField({
        value: goodsDetail.goods_des,
      }),
      goods_warning_status: Form.createFormField({
        value: goodsDetail.goods_warning_status,
      }),
      goods_nums_warning: Form.createFormField({
        value: goodsDetail.goods_nums_warning,
      }),
      goods_country_id: Form.createFormField({
        value: goodsDetail.goods_country_id,
      }),
      goods_warehouse_type: Form.createFormField({
        value: goodsDetail.goods_warehouse_type,
      }),
      supplier_id: Form.createFormField({
        value: goodsDetail.supplier_id,
      }),
      warehouse_id: Form.createFormField({
        value: goodsDetail.warehouse_id,
      }),
      shop_shipping_type: Form.createFormField({
        value: goodsDetail.shop_shipping_type,
      }),
      shipping_template_id: Form.createFormField({
        value: goodsDetail.goods_shipping_template_id,
      }),
      shop_shipping_calculation_type: Form.createFormField({
        value: goodsDetail.shop_shipping_calculation_type,
      }),
      shop_goods_reduced_inventory: Form.createFormField({
        value: goodsDetail.shop_goods_reduced_inventory,
      }),
      goods_shelves_type: Form.createFormField({
        value: goodsDetail.goods_shelves_type,
      }),
      goods_shelves_time: Form.createFormField({
        value: moment(goodsDetail.goods_shelves_time, 'YYYY-MM-DD HH:mm:ss'),
      }),
      goods_description: Form.createFormField({
        value: goodsDetail.goods_description,
      }),
      goods_is_worry_free_sale: Form.createFormField({
        value: goodsDetail.goods_is_worry_free_sale,
      }),
      goods_is_show: Form.createFormField({
        value: goodsDetail.goods_is_show,
      }),
      goods_is_refund: Form.createFormField({
        value: goodsDetail.goods_is_refund,
      }),
      goods_is_return_goods: Form.createFormField({
        value: goodsDetail.goods_is_return_goods,
      }),
      goods_is_return_server: Form.createFormField({
        value: goodsDetail.goods_is_return_server,
      }),
      goods_is_fast_delivery: Form.createFormField({
        value: goodsDetail.goods_is_fast_delivery,
      }),
      goods_is_recommend_show: Form.createFormField({
        value: goodsDetail.goods_is_recommend_show,
      }),
      profit_type: Form.createFormField({
        value: goodsDetail.profit_type,
      }),
    };
    if (systemType.user_levels && systemType.user_levels.length) {
      systemType.user_levels.forEach(res => {
        arr[`level_${res.id}`] = Form.createFormField({
          value: goodsDetail[`level_${res.id}`],
        });
      });
    }
    return arr;
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})(props => {
  //  111
  const { getFieldDecorator, validateFields } = props.form;
  const onValidateForm = e => {
    e.preventDefault();
    const { submitForm } = props;
    validateFields((err, values) => {
      if (!err) {
        submitForm(values);
      }
    });
  };
  const {
    goods: {
      systemType,
      brandList,
      typeName,
      uploadGoodsImg,
      goodsPlace,
      goodsDetail,
      initGoodsAttr,
      attrTable,
      levelPartialSon,
    },
    payload,
    header,
    previewImage,
    previewVisible,
    handleChangeImg,
    handlePreviewImg,
    handleCancelImg,
    setDescription,
    onCheckAllAttr,
    onChangeSon,
    chgLevelHas,
    modifiedValue,
  } = props;
  const brandListItem = [];
  const attrItem = [];
  const attrItemSon = [];
  initGoodsAttr.forEach((res, index) => {
    attrItem.push(
      <Checkbox onChange={onCheckAllAttr.bind(this, index)} checked={res.checked} key={res.id}>
        {res.name}
      </Checkbox>
    );
    attrItemSon.push(
      <div key={index} className={`${styles.borderList} ${res.checked ? '' : styles.borderHidden}`}>
        <span key={res.id + index} style={{ marginRight: 10 }}>
          {res.name}:
        </span>
        <CheckboxGroup
          rowKey={index => index}
          options={res.AttrArr}
          value={res.checkArr}
          onChange={onChangeSon.bind(this, index)}
        />
      </div>
    );
  });
  brandList.forEach(res => {
    brandListItem.push(
      <Option key={res.brand_id} value={res.brand_id}>
        {res.brand_name}
      </Option>
    );
  });
  // 上传按钮
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">主体图片</div>
    </div>
  );
  // 地址
  const goodsPlaceItem = [];
  goodsPlace.forEach(res => {
    goodsPlaceItem.push(
      <Option key={res.place_id} value={res.place_id}>
        {res.place_name}
      </Option>
    );
  });
  const goodsShelvesItem = []; // 上架方式
  const levelNumberItem = []; // 分佣等级
  const shippingTemplatesItem = []; // 运送模版
  const goodsShippingItem = []; // 快递
  const goodsStatusItem = []; // 商品状态
  const goodsTypeItem = []; // 商品类型
  const goodsWarehouseItem = []; // 商品发货方式
  const isItem = []; // 是否
  const isHotItem = []; // 是否首页推荐
  const profitTypeItem = []; // 分拥类型
  const reducedInventpryItem = []; // 减库存方式
  const shippingTypeItem = []; // 运送模板
  if (Object.keys(systemType).length) {
    systemType.user_levels.forEach(res => {
      levelNumberItem.push(
        <Col span={8} key={res.id}>
          <Form.Item {...formItemLayouts} label={res.name}>
            {getFieldDecorator(`level_${res.id}`, {
              rules: [{ required: true, message: `${res.name}` }],
            })(
              goodsDetail.profit_type === 0 ? (
                <InputNumber
                  min={0}
                  max={100}
                  formatter={value =>
                    `${goodsDetail.sell_goods_price && goodsDetail.cost_price ? value : 0}%`
                  }
                  parser={value => value.replace('%', '')}
                  onChange={e => chgLevelHas(res, e)}
                />
              ) : (
                <InputNumber
                  step={0.01}
                  precision={2}
                  min={0}
                  onChange={e => chgLevelHas(res, e)}
                />
              )
            )}
          </Form.Item>
        </Col>
      );
    });
    systemType.goods_shelves_type.forEach((res, index) => {
      goodsShelvesItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.goods_shipping_calculation_type.forEach((res, index) => {
      goodsShippingItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.goods_status.forEach((res, index) => {
      goodsStatusItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.goods_type.forEach((res, index) => {
      goodsTypeItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.goods_warehouse_type.forEach((res, index) => {
      goodsWarehouseItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.shipping_templates.forEach(res => {
      shippingTemplatesItem.push(
        <Option value={res.id} key={res.id}>
          {res.name}
        </Option>
      );
    });
    systemType.is.forEach((res, index) => {
      isItem.push(
        // <Option value={index} key={index}>{res}</Option>
        <Radio value={index} key={index}>
          {res}
        </Radio>
      );
    });
    systemType.is_hot.forEach((res, index) => {
      isHotItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.profit_type.forEach((res, index) => {
      profitTypeItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.reduced_inventpry.forEach((res, index) => {
      reducedInventpryItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
    systemType.shipping_type.forEach((res, index) => {
      shippingTypeItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
      );
    });
  }
  return (
    <Form layout="horizontal" className={styles.stepForm} autoComplete="OFF">
      <Card title="商品信息" style={{ marginBottom: '20px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品类别">
              <span>{typeName}</span>
            </Form.Item>
          </Col>
        </Row>
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
        <Form.Item {...formItemLayout} label="商品描述">
          {getFieldDecorator('goods_des', {
            rules: [{ required: true, message: '请填写商品描述' }],
          })(<TextArea placeholder="请填写商品描述" autosize />)}
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品品牌">
              {getFieldDecorator('brand_id', {
                rules: [{ required: true, message: '请填写商品品牌' }],
              })(<Select>{brandListItem}</Select>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品标题">
              {getFieldDecorator('goods_title', {
                rules: [{ required: true, message: '请填写商品标题' }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="销售价格">
              {getFieldDecorator('sell_goods_price', {
                rules: [{ required: true, message: '请填写商品销售价格' }],
              })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="市场价">
              {getFieldDecorator('goods_price', {
                rules: [{ required: true, message: '请填写商品市场价' }],
              })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="成本价">
              {getFieldDecorator('cost_price', {
                rules: [{ required: true, message: '请填写商品成本价' }],
              })(
                <InputNumber
                  step={0.01}
                  precision={2}
                  min={0.01}
                  max={Number(goodsDetail.sell_goods_price || 0)}
                  style={{ width: '200px' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品类型">
              {getFieldDecorator('goods_type', {
                rules: [{ required: true, message: '请填写商品类型' }],
              })(<Select>{goodsTypeItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品状态">
              {getFieldDecorator('goods_status', {
                rules: [{ required: true, message: '请填写商品状态' }],
              })(<Select>{goodsStatusItem}</Select>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="产品总库存">
              {getFieldDecorator('goods_total_inventory', {
                rules: [{ required: true, message: '请填写产品总库存' }],
              })(<InputNumber step={1} min={1} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品重量">
              {getFieldDecorator('weight', {
                rules: [{ required: true, message: '请填写商品重量' }],
              })(<InputNumber step={0.01} precision={2} min={0} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="排序">
              {getFieldDecorator('goods_sort', {
                rules: [{ required: true, message: '请填写商品排序' }],
              })(<InputNumber step={1} min={1} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item {...formItemLayoutUploadImg} label="主体图片">
              {getFieldDecorator('xxx', {
                rules: [{ required: true, message: '请填写商品排序' }],
              })(
                <div className="clearfix">
                  <Upload
                    action="http://hlsj.test.seastart.cn/admin/upload"
                    listType="picture-card"
                    fileList={uploadGoodsImg}
                    onPreview={handlePreviewImg}
                    onChange={handleChangeImg}
                    data={payload}
                    headers={header}
                  >
                    {uploadGoodsImg.length >= 6 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={handleCancelImg}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="设置预警">
              {getFieldDecorator('goods_warning_status', {
                rules: [{ required: true, message: '请填写设置预警' }],
              })(<RadioGroup>{isItem}</RadioGroup>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            {goodsDetail.goods_warning_status === 1 ? (
              <Form.Item {...formItemLayouts} label="预警值">
                {getFieldDecorator('goods_nums_warning', {
                  rules: [
                    { required: goodsDetail.goods_warning_status === 1, message: '请填写预警值' },
                  ],
                })(<InputNumber step={1} min={1} style={{ width: 200 }} />)}
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="采购地">
              {getFieldDecorator('goods_country_id', {
                rules: [{ required: true, message: '请填写采购地' }],
              })(<Select>{goodsPlaceItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="出货类型">
              {getFieldDecorator('goods_warehouse_type', {
                rules: [{ required: true, message: '请填写出货类型' }],
              })(<Select>{goodsWarehouseItem}</Select>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            {goodsDetail.goods_warehouse_type === 1 ? (
              <Form.Item {...formItemLayouts} label="供应商ID">
                {getFieldDecorator('supplier_id', {
                  rules: [
                    { required: goodsDetail.goods_warehouse_type === 1, message: '请填写供应商ID' },
                  ],
                })(<Input />)}
              </Form.Item>
            ) : (
              <Form.Item {...formItemLayouts} label="发货仓库">
                {getFieldDecorator('warehouse_id', {
                  rules: [
                    { required: goodsDetail.goods_warehouse_type === 0, message: '请填写发货仓库' },
                  ],
                })(<Input />)}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item {...formItemLayouts} label="供应商ID">
              {getFieldDecorator('supplier_id', {
                rules: [{ required: true, message: '请填写供应商ID' }],
              })(<Input />)}
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="运送类型">
              {getFieldDecorator('shop_shipping_type', {
                rules: [{ required: true, message: '请填写运送类型' }],
              })(
                <Select>
                  {/* <Option value="0">运费模板 </Option>
                  <Option value="1">固定运费</Option>
                  <Option value="2">包邮</Option> */}
                  {shippingTypeItem}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            {goodsDetail.shop_shipping_type === 0 ? (
              <Form.Item {...formItemLayouts} label="运费模版">
                {getFieldDecorator('shipping_template_id', {
                  rules: [
                    { required: goodsDetail.shop_shipping_type === 0, message: '请填写运费模版' },
                  ],
                })(<Select>{shippingTemplatesItem}</Select>)}
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="快递类型">
              {getFieldDecorator('shop_shipping_calculation_type', {
                rules: [{ required: true, message: '请填写快递类型' }],
              })(
                <Select>
                  {/* <Option value="0">快递</Option>
                  <Option value="1">EMS</Option> */}
                  {goodsShippingItem}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="减库存方式">
              {getFieldDecorator('shop_goods_reduced_inventory', {
                rules: [{ required: true, message: '请填写减库存方式' }],
              })(
                <Select>
                  {/* <Option value="0">拍下减库存</Option>
                  <Option value="1">付款减库存</Option> */}
                  {reducedInventpryItem}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="上架方式">
              {getFieldDecorator('goods_shelves_type', {
                rules: [{ required: true, message: '请填写上架方式' }],
              })(<Select>{goodsShelvesItem}</Select>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            {goodsDetail.goods_shelves_type === 1 ? (
              <Form.Item {...formItemLayouts} label="上架时间">
                {getFieldDecorator('goods_shelves_time', {
                  rules: [
                    {
                      required: goodsDetail.goods_shelves_type === 1,
                      message: '请填写商品上架时间',
                    },
                  ],
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择商品上架时间"
                  />
                )}
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Form.Item label="描述">
          {getFieldDecorator('goods_description', {
            rules: [{ required: true, message: '请填写描述' }],
          })(
            <ReactEditor valueSon={goodsDetail.goods_description} setDescription={setDescription} />
          )}
        </Form.Item>
      </Card>
      <Card style={{ margin: '20px 0' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="无忧售后">
              {getFieldDecorator('goods_is_worry_free_sale', {
                rules: [{ required: true, message: '请填写是否无忧售后' }],
              })(
                <RadioGroup>
                  {/* <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio> */}
                  {isItem}
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
                  {/* <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio> */}
                  {isItem}
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
                  {/* <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio> */}
                  {isItem}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="支持退货">
              {getFieldDecorator('goods_is_return_goods', {
                rules: [{ required: true, message: '请填写是否支持退货' }],
              })(<RadioGroup>{isItem}</RadioGroup>)}
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
                  {/* <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio> */}
                  {isItem}
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
                  {/* <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio> */}
                  {isItem}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="首页推荐">
              {getFieldDecorator('goods_is_recommend_show', {
                rules: [{ required: true, message: '请填写首页推荐' }],
              })(<Select>{isHotItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card title="sku分佣">
        <Form.Item {...formItemLayout} label="分拥类型">
          {getFieldDecorator('profit_type', {
            rules: [{ required: true, message: '请填写分拥类型' }],
          })(<Select>{profitTypeItem}</Select>)}
        </Form.Item>
        <div>分佣值</div>
        <Row>{levelNumberItem}</Row>
        <div className={styles.borderList}>
          <span>属性名：</span>
          {attrItem}
        </div>
        {attrItemSon}
        <EditTable
          attrTable={attrTable}
          totalPrice={goodsDetail.sell_goods_price}
          totalStock={goodsDetail.goods_total_inventory}
          levelPartialSon={levelPartialSon}
          rowKey={index => JSON.stringify(index)}
          modifiedValue={modifiedValue.bind(this)}
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
        <Button type="primary" onClick={onValidateForm}>
          提交
        </Button>
        <Button style={{ marginLeft: 8 }}>上一步</Button>
      </Form.Item>
    </Form>
  );
});

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
// @Form.create()
class EditGoodStep2 extends React.PureComponent {
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
  // 富文本
  setDescription = e => {
    console.log(e);
    const obj = {};
    obj.goods_description = {
      value: e,
    };
    this.changeFormVal(obj);
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
  };
  chgLevelHas = (index, e) => {
    const { dispatch, goods: { goodsDetail } } = this.props;
    const {
      profit_type: profitType,
      cost_price: costPrice,
      sell_goods_price: sellGoodsPrice,
    } = goodsDetail;
    if (typeof profitType === 'undefined') {
      message.error('请选择分佣类型');
    } else if (profitType === 0 && !costPrice) {
      message.error('请填写成本价格！');
    } else if (profitType === 0 && !sellGoodsPrice) {
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
  };
  // 修改表单值
  changeFormVal = val => {
    const { dispatch } = this.props;
    const obj = {};
    for (const key of Object.keys(val)) {
      obj[key] = val[key].value;
    }
    dispatch({
      type: 'goods/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 提交表单
  submitForm = values => {
    const { goods: { uploadGoodsImg, goodsDetail }, dispatch } = this.props;
    console.log(goodsDetail);
    if (!uploadGoodsImg.length) {
      message.error('请上传图片主体！');
      return;
    }
    const { goods: { attrTable, levelPartial, typePartial } } = this.props;
    if (attrTable.length) {
      attrTable.forEach(ele => {
        if (!ele.fileList.length) {
          ele.img = '';
        } else {
          ele.img = ele.fileList[0].url;
        }
        const arr = [];
        const obj = {};
        levelPartial.forEach(res => {
          obj[res.id] = res.value;
        });
        ele.profit.forEach(res => {
          arr.push({
            price: ele.values[res.id],
            id: res.id,
            profit_value: obj[res.id],
          });
        });
        ele.profit = arr;
      });
    } else {
      const arr = [];
      if (values.profit_type === '1') {
        levelPartial.forEach(res => {
          arr.push({
            price: res.value,
            profit_value: res.value,
            id: res.id,
          });
        });
      } else {
        levelPartial.forEach(res => {
          const nowPrice = (
            res.value *
            (values.sell_goods_price - values.cost_price) /
            100
          ).toFixed(2);
          arr.push({
            price: nowPrice,
            profit_value: nowPrice,
            id: res.id,
          });
        });
      }
      attrTable.push({
        sku_goods_name: '默认',
        store_nums: values.goods_total_inventory,
        goods_sku_sn: values.goods_sn,
        weight: values.weight,
        price: values.sell_goods_price,
        img: '',
        profit: arr,
        goods_sku_attr: [
          {
            attr_class_id: 1,
            attr_id: 1,
            attr_class_name: '默认',
            attr_name: '默认',
          },
        ],
      });
    }
    values.class_id = goodsDetail.class_id;
    values.category_id = goodsDetail.category_id;
    values.goods_id = goodsDetail.goods_id;
    values.goods_img = [];
    uploadGoodsImg.forEach(res => {
      values.goods_img.push(res.url);
    });
    // 新增需要加的
    values.goods_nums_warning = values.goods_nums_warning || 0;
    values.warehouse_id = values.warehouse_id || 0;
    values.supplier_id = values.supplier_id || 0;
    values.shop_shipping_price = values.shop_shipping_price || 0;
    values.profit_value = levelPartial;
    values.goods_sku = attrTable;
    values.profit_type = typePartial;
    if (values.goods_shelves_time) {
      values.goods_shelves_time = Number.parseInt(new Date(moment(values._d)).getTime() / 1000, 10);
    } else {
      values.goods_shelves_time = 0;
    }
    console.log(values);
    dispatch({
      type: 'goods/addShop',
      payload: {
        ...values,
      },
    });
  };

  render() {
    return (
      <CustomizedForm
        {...this.state}
        submitForm={this.submitForm}
        handleChangeImg={this.handleChangeImg}
        handlePreviewImg={this.handlePreviewImg}
        handleCancelImg={this.handleCancelImg}
        onChange={this.changeFormVal}
        {...this.props}
        setDescription={this.setDescription}
        onCheckAllAttr={this.onCheckAllAttr}
        onChangeSon={this.onChangeSon}
        chgLevelHas={this.chgLevelHas}
        modifiedValue={this.modifiedValue}
      />
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['goods/addShop'],
  data: form.step,
}))(EditGoodStep2);
