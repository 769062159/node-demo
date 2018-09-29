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
  Tag,
} from 'antd';
import moment from 'moment';
import ReactEditor from 'components/ReactEditor';
import EditTable from 'components/editTable';
import styles from './style.less';
import { deepCopy, correctionTime } from '../../../utils/utils';

// const { TextArea } = Input;
// const RadioGroup = Radio.Group;
// const nowReactEditor = new Date().getTime(); // 现在时间用于富文本
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
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const spcialLayouts = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
const profitLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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
const now = new Date();
const weekNow = new Date(now.getTime() + 7 * 60 * 1000 * 60 * 24);

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const { goods: { goodsDetail, systemType } } = props;
    const { group_start_time: groupStartTime, group_end_time: groupEndTime } = goodsDetail;
    if (typeof groupStartTime === 'number') {
      goodsDetail.group_start_time = new Date(groupStartTime * 1000);
    } else if (typeof groupStartTime === 'object' || typeof groupEndTime === 'undefined') {
      goodsDetail.group_start_time = now;
    }
    if (typeof groupEndTime === 'number') {
      goodsDetail.group_end_time = new Date(groupEndTime * 1000);
    } else if (typeof groupEndTime === 'object' || typeof groupEndTime === 'undefined') {
      goodsDetail.group_end_time = weekNow;
    }
    const arr = {
      group_share_title: Form.createFormField({
        value: goodsDetail.group_share_title,
      }),
      is_return_profit: Form.createFormField({
        value: goodsDetail.is_return_profit,
      }),
      is_grouper_free: Form.createFormField({
        value: goodsDetail.is_grouper_free,
      }),
      is_group: Form.createFormField({
        value: goodsDetail.is_group,
      }),
      limit_buy: Form.createFormField({
        value: goodsDetail.limit_buy,
      }),
      group_price: Form.createFormField({
        value: goodsDetail.group_price,
      }),
      sale_channel: Form.createFormField({
        value: goodsDetail.sale_channel,
      }),
      group_pick_up_duration: Form.createFormField({
        value: goodsDetail.group_pick_up_duration,
      }),
      group_num: Form.createFormField({
        value: goodsDetail.group_num,
      }),
      group_duration: Form.createFormField({
        value: goodsDetail.group_duration,
      }),
      goods_name: Form.createFormField({
        value: goodsDetail.goods_name,
      }),
      goods_sn: Form.createFormField({
        value: goodsDetail.goods_sn,
      }),
      goods_list_title: Form.createFormField({
        value: goodsDetail.goods_list_title,
      }),
      goods_des: Form.createFormField({
        value: goodsDetail.goods_des,
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
      weight: Form.createFormField({
        value: goodsDetail.weight,
      }),
      cost_price: Form.createFormField({
        value: goodsDetail.cost_price,
      }),
      xxx: Form.createFormField({
        value: goodsDetail.xxx,
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
        value: goodsDetail.shipping_template_id,
      }),
      shop_shipping_price: Form.createFormField({
        value: goodsDetail.shop_shipping_price,
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
      // goods_shelves_time: Form.createFormField({
      //   value: goodsDetail.goods_shelves_time,
      //     // ? moment(goodsDetail.goods_shelves_time, 'YYYY-MM-DD HH:mm:ss')
      //     // : null,
      // }),
      // group_start_time: Form.createFormField({
      //   value: goodsDetail.group_start_time
      //     ? moment(goodsDetail.group_start_time, 'YYYY-MM-DD HH:mm:ss')
      //     : null,
      // }),
      group_start_time: Form.createFormField({
        value: moment(goodsDetail.group_start_time, 'YYYY-MM-DD HH:mm:ss'),
      }),
      group_end_time: Form.createFormField({
        value: moment(goodsDetail.group_end_time, 'YYYY-MM-DD HH:mm:ss'),
      }),
      // group_end_time: Form.createFormField({
      //   value: goodsDetail.group_end_time
      //     ? moment(goodsDetail.group_end_time, 'YYYY-MM-DD HH:mm:ss')
      //     : null,
      // }),
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
      category_id: Form.createFormField({
        value: goodsDetail.category_id,
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
  // onValuesChange(_, values) {
  //   console.log(values);
  // },
})(props => {
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
      uploadGoodsImg,
      goodsPlace,
      goodsDetail,
      initGoodsAttr,
      attrTable,
      levelPartialSon,
      typePartial,
      skuInputArr,
      goodsClass,
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
    uploadUrl,
    changeTypePartial,
    addSpec,
    addSpecSon,
    setSkuArrVal,
    deleteSku,
  } = props;
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
  const saleChannelsItem = []; // 线上商品线下商品
  const goodsShelvesItem = []; // 上架方式
  const levelNumberItem = []; // 分佣等级
  const shippingTemplatesItem = []; // 运送模版
  const goodsShippingItem = []; // 快递
  const goodsStatusItem = []; // 商品状态
  const goodsTypeItem = []; // 商品类型
  const isItem = []; // 是否
  const isHotItem = []; // 是否首页推荐
  const profitTypeItem = []; // 分拥类型
  const reducedInventpryItem = []; // 减库存方式
  const shippingTypeItem = []; // 运送模板
  const goodsTypeListItem = []; // 商品分类
  if (goodsClass.length) {
    goodsClass.forEach(res => {
      goodsTypeListItem.push(
        <Option value={res.class_id} key={res.class_id}>
          {res.class_name}
        </Option>
      );
    });
  }
  if (Object.keys(systemType).length) {
    systemType.user_levels.forEach(res => {
      levelNumberItem.push(
        <Col span={8} key={res.id}>
          <Form.Item {...profitLayout} label={res.name}>
            {getFieldDecorator(`level_${res.id}`, {
              rules: [{ required: true, message: `${res.name}` }],
            })(
              goodsDetail.profit_type === 0 ? (
                <InputNumber
                  min={0}
                  max={100}
                  formatter={value =>
                    `${goodsDetail.sell_goods_price ? value : 0}%`
                  }
                  parser={value => value.replace('%', '')}
                  onChange={e => chgLevelHas(res, e)}
                />
              ) : (
                <InputNumber
                  step={0.01}
                  precision={2}
                  min={0}
                  max={goodsDetail.sell_goods_price}
                  formatter={value =>
                    `${goodsDetail.sell_goods_price ? value : 0}`
                  }
                  parser={value => value}
                  onChange={e => chgLevelHas(res, e)}
                />
              )
            )}
          </Form.Item>
        </Col>
      );
    });
    systemType.sale_channels.forEach((res, index) => {
      saleChannelsItem.push(
        <Option value={index} key={index}>
          {res}
        </Option>
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
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="商品分类">
              {getFieldDecorator('category_id', {
                rules: [{ required: true, message: '请填写商品分类' }],
              })(<Select style={{ width: 200 }}>{goodsTypeListItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item {...formItemLayout} label="商品名称">
          {getFieldDecorator('goods_name', {
            rules: [{ required: true, message: '请填写商品名称' }],
          })(<Input />)}
        </Form.Item>
        {/* <Form.Item {...formItemLayout} label="商品SN">
          {getFieldDecorator('goods_sn', {
            rules: [{ required: true, message: '请填写商品SN' }],
          })(<Input />)}
        </Form.Item> */}
        <Form.Item {...formItemLayouts} label="商品标题">
          {getFieldDecorator('goods_title', {
            rules: [{ required: true, message: '请填写商品标题' }],
          })(<Input />)}
        </Form.Item>
        {/* <Form.Item {...formItemLayout} label="商品描述">
          {getFieldDecorator('goods_des', {
            rules: [{ required: true, message: '请填写商品描述' }],
          })(<TextArea placeholder="请填写商品描述" autosize />)}
        </Form.Item> */}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="销售价格">
              {getFieldDecorator('sell_goods_price', {
                rules: [{ required: true, message: '请填写商品销售价格' }],
              })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="成本价">
              {getFieldDecorator('cost_price', {
                rules: [{ required: true, message: '请填写商品成本价' }],
              })(
                <InputNumber
                  step={0.01}
                  precision={2}
                  min={0}
                  max={Number(goodsDetail.sell_goods_price || 0)}
                  style={{ width: '200px' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="市场价">
              {getFieldDecorator('goods_price', {
                rules: [{ required: true, message: '请填写商品市场价' }],
              })(<InputNumber step={0.01} precision={2} min={0.01} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item {...formItemLayouts} label="商品类型">
              {getFieldDecorator('goods_type', {
                rules: [{ required: true, message: '请填写商品类型' }],
              })(<Select>{goodsTypeItem}</Select>)}
            </Form.Item>
          </Col> */}
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="产品总库存">
              {getFieldDecorator('goods_total_inventory', {
                rules: [{ required: true, message: '请填写产品总库存' }],
              })(<InputNumber step={1} min={0} style={{ width: '200px' }} />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="商品状态">
              {getFieldDecorator('goods_status', {
                rules: [{ required: true, message: '请填写商品状态' }],
              })(<Select style={{ width: 200 }}>{goodsStatusItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="商品重量">
              {getFieldDecorator('weight', {
                rules: [{ required: true, message: '请填写商品重量' }],
              })(
                <InputNumber
                  step={0.01}
                  style={{ width: 200 }}
                  precision={2}
                  min={0}
                  formatter={value => `${value}KG`}
                  parser={value => value.replace('KG', '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24} className={styles.extraTag}>
            <Form.Item
              {...formItemLayouts}
              label="排序"
              extra={<Tag color="blue">序号大的排在前面</Tag>}
            >
              {getFieldDecorator('goods_sort', {
                rules: [{ required: true, message: '请填写商品排序' }],
              })(<InputNumber step={1} style={{ width: 200 }} min={1} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              {...formItemLayoutUploadImg}
              label="主体图片"
              extra={<Tag color="blue">建议尺寸750px*750px，大小不得大于1M</Tag>}
            >
              {getFieldDecorator('xxx', {
                rules: [{ required: true, message: '请填写主体图片' }],
              })(
                <div className="clearfix">
                  <Upload
                    action={uploadUrl}
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
        {/* <Row gutter={24}>
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
        </Row> */}
        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="采购地">
              {getFieldDecorator('goods_country_id', {
                rules: [{ required: true, message: '请填写采购地' }],
              })(<Select>{goodsPlaceItem}</Select>)}
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row gutter={24}>
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
        </Row> */}
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item {...formItemLayouts} label="供应商ID">
              {getFieldDecorator('supplier_id', {
                rules: [{ required: true, message: '请填写供应商ID' }],
              })(<Input />)}
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item {...spcialLayouts} label="运送类型">
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
              <Form.Item {...spcialLayouts} label="运费模版">
                {getFieldDecorator('shipping_template_id', {
                  rules: [
                    { required: goodsDetail.shop_shipping_type === 0, message: '请填写运费模版' },
                  ],
                })(<Select>{shippingTemplatesItem}</Select>)}
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item {...formItemLayouts} label="是否拼团">
              {getFieldDecorator('is_group', {
                rules: [{ required: true, message: '请选择是否拼团' }],
              })(
                <Select>
                  <Option value={1} key={1}>
                    参加
                  </Option>
                  <Option value={0} key={0}>
                    不参加
                  </Option>
                </Select>
            )}
            </Form.Item>
          </Col>
        </Row>
        {
          goodsDetail.is_group === 1 ? (
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayouts} label="提货方式">
                  {getFieldDecorator('sale_channel', {
                    rules: [{ required: true, message: '请选择提货方式' }],
                  })(<Select>{saleChannelsItem}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...spcialLayouts} label="分享标题">
                  {getFieldDecorator('group_share_title', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请输入分享标题' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              {/* <Col span={12}>
                <Form.Item {...spcialLayouts} label="是否返佣">
                  {getFieldDecorator('is_return_profit', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择是否返佣' }],
                  })(
                    <Select>
                      <Option value={1} key={1}>
                        是
                      </Option>
                      <Option value={0} key={0}>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item {...spcialLayouts} label="团长是否免费">
                  {getFieldDecorator('is_grouper_free', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择团长是否免费' }],
                  })(
                    <Select>
                      <Option value={1} key={1}>
                        是
                      </Option>
                      <Option value={0} key={0}>
                        否
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...spcialLayouts} label="团购人数">
                  {getFieldDecorator('group_num', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择团购人数' }],
                  })(<InputNumber min={1} max={10} />)}
                </Form.Item>
              </Col>
              <Col span={12}  className={styles.inlineExtra}>
                <Form.Item {...spcialLayouts} label="拼团时长" extra="小时">
                  {getFieldDecorator('group_duration', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择拼团时长' }],
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Col>
              <Col span={12} className={styles.inlineExtra}>
                <Form.Item {...spcialLayouts} label="取货时间" extra="天">
                  {getFieldDecorator('group_pick_up_duration', {
                    rules: [{ required: goodsDetail.sale_channel === 1, message: '请选择取货时间' }],
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item {...spcialLayouts} label="单人限购数量" extra="0为不限购">
                  {getFieldDecorator('limit_buy', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择限购数量' }],
                  })(<InputNumber min={0} />)}
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item {...spcialLayouts} label="团购价格">
                  {getFieldDecorator('group_price', {
                    rules: [{ required: goodsDetail.is_group === 1, message: '请选择团购价格' }],
                  })(<InputNumber min={0} step={0.01} precision={2} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...spcialLayouts} label="团购开始时间" >
                  {getFieldDecorator('group_start_time', {
                    rules: [
                      {
                        required: goodsDetail.is_group === 1,
                        message: '请填写团购开始时间',
                      },
                    ],
                    getValueFromEvent: (date, dateString) => {
                      return dateString;
                    },
                  })(
                    <DatePicker
                      style={{width: 200}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="选择团购开始时间"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...spcialLayouts} label="团购结束时间">
                  {getFieldDecorator('group_end_time', {
                    rules: [
                      {
                        required: goodsDetail.is_group === 1,
                        message: '请填写团购结束时间',
                      },
                    ],
                    getValueFromEvent: (date, dateString) => {
                      return dateString;
                    },
                  })(
                    <DatePicker
                      style={{width: 200}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="选择团购结束时间"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          ) : null
        }
        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="快递类型">
              {getFieldDecorator('shop_shipping_calculation_type', {
                rules: [{ required: true, message: '请填写快递类型' }],
              })(
                <Select>
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
                  {reducedInventpryItem}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row> */}

        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...spcialLayouts} label="上架方式">
              {getFieldDecorator('goods_shelves_type', {
                rules: [{ required: true, message: '请填写上架方式' }],
              })(<Select>{goodsShelvesItem}</Select>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            {goodsDetail.goods_shelves_type === 1 ? (
              <Form.Item {...spcialLayouts} label="上架时间">
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
        </Row> */}
        {/* <Form.Item label="商品参数">
          {getFieldDecorator('goods_des', {
            rules: [{ required: true, message: '请填写商品参数' }],
          })(
            <ReactEditor
              uploadUrl={uploadUrl}
              valueSon={goodsDetail.goods_des || ''}
              goodsId={goodsDetail.goods_id}
              setDescription={setDescription.bind(this, 1)}
            />
          )}
        </Form.Item> */}
        <Form.Item label="描述">
          {getFieldDecorator('goods_description', {
            rules: [{ required: true, message: '请填写描述' }],
          })(
            <ReactEditor
              uploadUrl={uploadUrl}
              // valueSon={goodsDetail.goods_description || ''}
              // goodsId={nowReactEditor}
              setDescription={setDescription.bind(this, 2)}
            />
          )}
        </Form.Item>
      </Card>
      {/* <Card style={{ margin: '20px 0' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formItemLayouts} label="无忧售后">
              {getFieldDecorator('goods_is_worry_free_sale', {
                rules: [{ required: true, message: '请填写是否无忧售后' }],
              })(
                <RadioGroup>
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
      </Card> */}
      <Card title="sku分佣">
        <Row>
          <Col span={8}>
            <Form.Item
              {...profitLayout}
              label="分佣类型"
              extra={<Tag color="blue">请先输入销售价格和成本价,切换分佣类型请重新设置分佣值</Tag>}
            >
              {getFieldDecorator('profit_type', {
                rules: [{ required: true, message: '请填写分拥类型' }],
              })(<Select onChange={changeTypePartial}>{profitTypeItem}</Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>{levelNumberItem}</Row>
        {/* 批量 */}
        {
          skuInputArr.length < 3 ? (
            <Button onClick={addSpec} style={{ marginBottom: 10 }} >添加规格项目</Button>
          ) : null
        }
        {
          skuInputArr.map((res, inx) => {
            return (
              <div className={styles.borderList} key={inx}>
                <div className={styles.specification}>
                  <span className={styles.title}>属性名：</span>
                  <div className={styles.specInput}>
                    <Input value={res.key} style={{ width: 200 }} onChange={setSkuArrVal.bind(this, inx, {})}  />
                    <img className={styles.close} src='/img/close.png' onClick={deleteSku.bind(this, inx, {})} alt="关闭" />
                  </div>
                </div>
                <div className={styles.specificationSon}>
                  {
                    res.val && res.val.map((ele, index) => {
                      return (
                        <div key={index} className={styles.specSonInput}>
                          <Input style={{ width: 200 }}  onChange={setSkuArrVal.bind(this, inx, index)} value={ele} />
                          <img className={styles.close} src='/img/close.png' alt="关闭" onClick={deleteSku.bind(this, inx, index)} />
                        </div>
                      )
                    })
                  }
                  {
                    res.key ? (
                      <div onClick={addSpecSon.bind(this, inx)}>添加规格值</div>
                    ) : null
                  }
                </div>
              </div>
            )
          })
        }
        {/* {attrItemSon} */}
        <EditTable
          isGroup={goodsDetail.is_group}
          attrTable={attrTable}
          typePartial={typePartial}
          totalPrice={goodsDetail.sell_goods_price}
          weight={goodsDetail.weight}
          totalStock={goodsDetail.goods_total_inventory}
          levelPartialSon={levelPartialSon}
          uploadUrl={uploadUrl}
          // rowKey={index => JSON.stringify(index)}
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
        {/* <Button style={{ marginLeft: 8 }}>上一步</Button> */}
      </Form.Item>
    </Form>
  );
});

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
class AddGoodStep2 extends React.PureComponent {
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
    const { type } = this.props.match.params;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/initGoodAttr',
      payload: {
        type,
      },
    });
    dispatch({
      type: 'goods/clearAttrTabe',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/initSku',
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
  setDescription = (type, e) => {
    const obj = {};
    if (type === 1) {
      obj.goods_des = {
        value: e,
      };
    } else {
      obj.goods_description = {
        value: e,
      };
    }
    this.changeFormVal(obj);
  };
  // 修改sku的值
  setSkuArrVal = (inx, index, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/setSkuArrVal',
      payload: {
        inx,
        index,
        val: e.target.value,
      },
    });
  }
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
  chgLevelHas = (data, e) => {
    const { dispatch, goods: { goodsDetail } } = this.props;
    const {
      profit_type: profitType,
      cost_price: costPrice,
      sell_goods_price: sellGoodsPrice,
    } = goodsDetail;
    if (typeof profitType === 'undefined') {
      message.error('请选择分佣类型');
    } else if (profitType === 0 && typeof costPrice === 'undefined') {
      message.error('请填写成本价格！');
    } else if (profitType === 0 && !sellGoodsPrice) {
      message.error('请填写销售价格！');
    } else {
      dispatch({
        type: 'goods/setLevelPartial',
        payload: {
          index: data.id,
          value: e,
        },
      });
    }
  };
  // 添加规格项目
  addSpec = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/addSpec',
    });
  }
  // 添加子规格
  addSpecSon = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/addSpecSon',
      payload: index,
    });
  }
  // 删除sku
  deleteSku = (inx, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/deleteSku',
      payload: {
        inx,
        index,
      },
    });
  }
  // 修改分佣等级
  changeTypePartial = e => {
    console.log(e);
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/changeTypePartials',
      payload: {
        e,
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
      type: 'goods/changeFormVal',
      payload: {
        obj,
      },
    });
  };
  // 提交表单
  submitForm = values => {
    const { goods: { uploadGoodsImg }, dispatch } = this.props;
    const { goods: { levelPartial, goodsDetail, skuInputArr } } = this.props;
    let { goods: { attrTable } } = this.props;
    if (!uploadGoodsImg.length) {
      message.error('请上传图片主体！');
      return;
    }
    // 暂时写死的
    values.goods_sn = ' ';
    values.profit_type = goodsDetail.profit_type;
    if (attrTable.length) {
      // attrTable.forEach(ele => {
      //   ele.goods_sku_sn = ' ';
      //   if (!ele.fileList.length) {
      //     ele.img = '';
      //   } else {
      //     ele.img = ele.fileList[0].url;
      //   }
      //   const arr = [];
      //   const obj = {};
      //   levelPartial.forEach(res => {
      //     obj[res.id] = res.value;
      //   });
      //   ele.profit = deepCopy(levelPartial);
      //   ele.profit.forEach(res => {
      //     arr.push({
      //       price: obj[res.id],
      //       id: res.id,
      //       level: res.id,
      //       profit_value: ele.values[res.id],
      //     });
      //   });
      //   ele.profit = arr;
      // });
      // attrTable.map(res => {
      //   const arr = deepCopy(res.goods_sku_attr);
      //   res.goods_sku_attr = arr.map(ele => {
      //     ele.attr_name = res[`sku_attr_name_${ele.attr_class_id}`];
      //     return ele;
      //   });
      //   return res;
      // });
      const skuCacheObj = {};
      const skuCacheArr = [];
      const isExistInObj = {};
      for(const ele of skuInputArr){
        if (!ele.key) {
          message.error('请输入属性名！');
          return false;
        }
        if (isExistInObj[ele.key]) {
          message.error('请勿输入属性名！');
          return false;
        } else {
          isExistInObj[ele.key] = 1;
        }
        const arr = [];
        for(const val of ele.val) {
          if (!val) {
            message.error('请输入规格！');
            return false;
          }
          if (skuCacheObj[val]) {
            message.error('请勿输入重复规格！');
            return false;
          }
          const obj = {
            attr_class_name: ele.key,
            attr_name: val,
          }
          arr.push({
            attr_name: val,
          })
          skuCacheObj[val] = obj;
        }
        skuCacheArr.push({
          attr_class_name: ele.key,
          attrs: arr,
        });
      }
      values.attr = skuCacheArr;
      attrTable = attrTable.map(res => {
        const skuArr = res.skuName.split('|,|');
        if (res.fileList.length) {
          res.img = res.fileList[0].url;
        } else {
          res.img = '';
        }
        const arr = [] ;
        skuArr.forEach(ele => {
          arr.push(skuCacheObj[ele]);
        })
        res.goods_sku_attr = arr;
        return res;
      })
      values.goods_sku = deepCopy(attrTable);
    } else {
      values.attr = [];
      values.goods_sku = [];
    }
    values.goods_img = [];
    uploadGoodsImg.forEach(res => {
      values.goods_img.push(res.url);
    });
    // const { type } = this.props.match.params;
    // 无一级分类了
    values.class_id = 0;
    // 新增需要加的
    values.goods_nums_warning = values.goods_nums_warning || 0;
    // values.warehouse_id = values.warehouse_id || 0;
    values.supplier_id = values.supplier_id || 0;
    values.shipping_template_id = values.shipping_template_id || 0;
    values.shop_shipping_price = values.shop_shipping_price || 0;
    // 参数变化id转成type
    const levelPartialCache = deepCopy(levelPartial);
    levelPartialCache.forEach(res => {
      res.level = res.id;
    });
    values.profit_value = levelPartialCache;
    // values.goods_sku = attrTable;
    // 暂时写死的字段
    values.goods_list_title = 0;
    values.goods_is_refund = 1;
    values.goods_type = 0;
    values.goods_warning_status = 0;
    values.goods_country_id = 1;
    values.shop_shipping_calculation_type = 0;
    values.shop_goods_reduced_inventory = 0;
    values.goods_is_worry_free_sale = 1;
    values.goods_is_show = 1;
    values.goods_is_return_goods = 1;
    values.goods_is_return_server = 1;
    values.goods_is_fast_delivery = 1;
    values.goods_is_recommend_show = 0;
    values.goods_des = values.goods_des || '';
    if (values.goods_shelves_time) {
      const date = correctionTime(values.goods_shelves_time._d);
      values.goods_shelves_time = Number.parseInt(date.getTime() / 1000, 10);
    } else {
      values.goods_shelves_time = 0;
    }
    // 团购新加的字段
    // values.sale_channel = values.is_group;
    const { group_start_time: groupStartTime, group_end_time: groupEndTime } = values;
    if (groupStartTime && typeof groupStartTime === 'object') {
      values.group_start_time = parseInt(new Date(values.group_start_time._i).getTime() / 1000, 10);
      // values.group_start_time = Number.parseInt(date.getTime() / 1000, 10);
    }else {
      values.group_start_time = groupStartTime || 0;
    }
    if (groupEndTime && typeof groupEndTime === 'object') {
      values.group_end_time = parseInt(new Date(values.group_end_time._i).getTime() / 1000, 10);
      // values.group_end_time = Number.parseInt(date.getTime() / 1000, 10);
    } else {
      values.group_end_time = groupEndTime || 0;
    }
    values.group_pick_up_duration = values.group_pick_up_duration || '';
    values.group_duration = values.group_duration || 0;
    values.group_num = values.group_num || 0;
    values.limit_buy = values.limit_buy || 0;
    values.group_price = values.group_price || 0;
    values.is_grouper_free = values.is_grouper_free || 0;
    values.is_return_profit = values.is_return_profit || 0;
    values.group_share_title = values.group_share_title || 0;
    // if (attrTable.length) {
    //   attrTable.map(res => {
    //     const arr = deepCopy(res.goods_sku_attr);
    //     res.goods_sku_attr = arr.map(ele => {
    //       ele.attr_name = res[`sku_attr_name_${ele.attr_class_id}`];
    //       return ele;
    //     });
    //     return res;
    //   });
    // }
    // values.goods_sku = deepCopy(attrTable);
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
        changeTypePartial={this.changeTypePartial}
        addSpec={this.addSpec}
        addSpecSon={this.addSpecSon}
        setSkuArrVal={this.setSkuArrVal}
        deleteSku={this.deleteSku}
      />
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(AddGoodStep2);
