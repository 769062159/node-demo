import React, { PureComponent } from 'react';
import { Table, Input, Icon, Popconfirm, Upload, Modal, Row, Col, Form, InputNumber } from 'antd';

class EditableCell extends PureComponent {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {editable ? (
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
          <div style={{ paddingRight: 24 }}>
            {value || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
class EditInputNumber extends PureComponent {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = e => {
    let values = e.target.value;
    const { totalStock, attrTable, value } = this.props;
    console.log(22);
    if (attrTable && attrTable.length) {
      if (typeof totalStock === 'undefined') {
        values = 0;
      } else {
        let num = Number(totalStock) + parseInt(value, 10);
        attrTable.forEach(ele => {
          num -= ele.store_nums;
        });
        console.log(999);
        console.log(num);
        console.log(values);
        console.log(attrTable);
        if (num < values) {
          values = num;
        }
      }
    }
    this.setState({ value: values });
  };
  edit = () => {
    this.setState({ editable: true });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      const { step, totalStock, attrTable } = this.props;
      let { value } = this.state;
      if (attrTable && attrTable.length) {
        if (typeof totalStock !== 'undefined') {
          let num = Number(totalStock);
          attrTable.forEach(ele => {
            num -= ele.store_nums;
          });
          console.log(999);
          console.log(num);
          console.log(value);
          console.log(attrTable);
          if (num < value) {
            value = num < 0 ? 0 : num;
          }
        }
      }
      value = Number(value);
      if (isNaN(value)) {
        value = 0;
      } else {
        value = value.toFixed(step);
      }
      this.setState({ value });
      this.props.onChange(value);
    }
  };
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {editable ? (
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
            suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
          />
        ) : (
          <div style={{ paddingRight: 24 }}>
            {value || ' '}
            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
// class EditInput extends PureComponent {
//   state = {
//     value: this.props.value,
//   };
//   handleChange = e => {
//     const value = e.target.value;
//     this.setState({ value });
//     // this.props.onChange(value);
//   };
//   check = () => {
//     if (this.props.onChange) {
//       this.props.onChange(this.state.value);
//     }
//   };
//   render() {
//     const { value } = this.state;
//     return (
//       <div className="editable-cell">
//         <Input
//           value={value}
//           onChange={this.handleChange}
//           onPressEnter={this.check}
//           suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
//         />
//       </div>
//     );
//   }
// }

class UploadImg extends PureComponent {
  state = {
    // value: this.props.value,
    previewVisible: false,
    previewImage: '',
    payload: {
      type: 2,
    },
    fileList: [],
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  componentWillMount() {
    this.setState({
      fileList: this.props.fileList,
    });
  }
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChangeImg = ({ fileList }) => {
    if (fileList.length) {
      this.setState({ fileList });
      fileList.forEach(item => {
        if (item.status === 'done' && item.uploaded !== 'done') {
          const img = {};
          img.status = 'done';
          img.uploaded = 'done';
          img.response = { status: 'success' };
          img.name = item.name;
          img.uid = item.uid;
          img.url = item.response.data;
          // return img;
          this.props.onChange([img]);
        }
        // return item;
      });
    }
    // this.setState({ fileList });
    // this.props.onChange(fileList);
  };
  removeImg = () => {
    this.props.onChange([]);
  };
  render() {
    const { previewVisible, previewImage, payload, header, fileList } = this.state;
    // const { fileList } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action="http://hlsj.test.seastart.cn/admin/upload"
          headers={header}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChangeImg}
          data={payload}
          onRemove={this.removeImg}
        >
          {fileList && fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
@Form.create()
export default class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attrTable: [],
      showData: {},
      levelVisible: false,
      index: 1,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { attrTable, levelPartialSon } = nextProps;
    attrTable.forEach(res => {
      if (res.values && !Object.keys(res.values).length) {
        levelPartialSon.forEach(ele => {
          res.values[ele.id] = ele.value;
        });
      }
    });
    console.log(attrTable);
    this.setState({
      attrTable,
    });
  }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     attrTable: nextProps.attrTable,
  //   });
  // }

  onCellChange = (index, dataIndex) => {
    return value => {
      console.log(value);
      const attrTable = [...this.state.attrTable];
      // const { totalStock } = this.props;
      // console.log(totalStock);
      // if (dataIndex === 'store_nums') {
      //   let num = totalStock;
      //   attrTable.forEach(res => {
      //     num -= res.store_nums;
      //   })
      //   console.log(num);
      //   if (num < value) {
      //     console.log(1);
      //     attrTable[index][dataIndex] = num;
      //   } else {
      //     console.log(2);
      //     attrTable[index][dataIndex] = value;
      //   }
      // } else {
      //   attrTable[index][dataIndex] = value;
      // }
      attrTable[index][dataIndex] = value;
      this.setState({ attrTable });
      this.props.modifiedValue(attrTable);
    };
  };
  onDelete = key => {
    const attrTable = [...this.state.attrTable];
    attrTable.splice(key, 1);
    this.props.modifiedValue(attrTable);
    this.setState({ attrTable });
  };

  //   handleAdd = () => {
  //     const { count, dataSource } = this.state;
  //     const newData = {
  //       key: count,
  //       name: `Edward King ${count}`,
  //       age: 32,
  //       address: `London, Park Lane no. ${count}`,
  //     };
  //     this.setState({
  //       dataSource: [...dataSource, newData],
  //       count: count + 1,
  //     });
  //   }
  levelSetting = index => {
    const { attrTable } = this.state;
    const arr = attrTable.slice(index);
    let showData = {};
    if (arr[0].values) {
      showData = arr[0].values;
    }
    // else {
    //     arr[0].profit.forEach(res => {
    //         showData[res.id] = res.value;
    //     });
    // }
    this.setState({
      levelVisible: true,
      showData,
      index,
    });
  };
  handleCancelLevel = () => {
    const { attrTable } = this.state;
    console.log(attrTable);
    this.setState({
      levelVisible: false,
    });
  };
  modalOk = () => {
    // const { index, showData, attrTable } = this.state;
    // attrTable[index].profit = showData;
    // this.setState({
    //   levelVisible: false,
    //   attrTable,
    // })
    // this.props.handleEmail(attrTable);
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        const { index, attrTable } = this.state;
        // const { profit } = attrTable[index];
        attrTable[index].values = values;
        // attrTable[index].profit = attrTable[index].profit.map(res => {
        //     if (values[res.id]) {
        //         res.value = values[res.id];
        //     }
        //     return res;
        // })
        this.setState({
          levelVisible: false,
        });
      }
    });
  };
  //   chgLevelHas = (index, e) => {
  //     const { showData } = this.state;
  //     showData[index] = e.target.value;
  //     this.setState({
  //       showData,
  //     });
  //   };
  render() {
    const { rowKey, form, totalPrice, totalStock, levelPartialSon } = this.props;
    const { attrTable, levelVisible, showData } = this.state;
    const { getFieldDecorator } = form;
    const profitItem = [];
    if (levelPartialSon.length) {
      levelPartialSon.forEach(res => {
        profitItem.push(
          <Col span={12} key={res.id}>
            <Form.Item label={res.name}>
              {getFieldDecorator(`${res.id}`, {
                initialValue: showData[res.id],
                rules: [{ required: true, message: `请填写${res.name}` }],
              })(
                <InputNumber step={0.01} precision={2} min={0.01} max={Number(totalPrice || 0)} />
              )}
            </Form.Item>
          </Col>
        );
      });
    }

    const columns = [
      {
        title: '图片',
        dataIndex: 'fileList',
        render: (text, record, index) => (
          <UploadImg fileList={text} onChange={this.onCellChange(index, 'fileList')} />
        ),
      },
      {
        title: 'sku属性',
        dataIndex: 'sku_goods_name',
        render: (text, record, index) => (
          <EditableCell value={text} onChange={this.onCellChange(index, 'sku_goods_name')} />
        ),
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (text, record, index) => (
          <EditInputNumber value={text} step={2} onChange={this.onCellChange(index, 'price')} />
        ),
      },
      {
        title: '库存',
        dataIndex: 'store_nums',
        render: (text, record, index) => (
          <EditInputNumber
            value={text}
            totalStock={totalStock}
            attrTable={attrTable}
            step={0}
            onChange={this.onCellChange(index, 'store_nums')}
          />
        ),
      },
      {
        title: '重量',
        dataIndex: 'weight',
        render: (text, record, index) => (
          <EditInputNumber value={text} step={2} onChange={this.onCellChange(index, 'weight')} />
        ),
      },
      {
        title: '等级',
        dataIndex: 'level',
        render: (text, record, index) => {
          return (
            <a className="ant-dropdown-link" onClick={this.levelSetting.bind(this, index)}>
              设置值
            </a>
          );
        },
      },
      //   {
      //     title: 'SKUSN',
      //     dataIndex: 'goods_sku_sn',
      //     render: (text, record, index) => (
      //       <EditInput value={text} onChange={this.onCellChange(index, 'goods_sku_sn')} />
      //     ),
      //   },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => {
          return (
            <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(index)}>
              <a href="">删除</a>
            </Popconfirm>
          );
        },
      },
    ];
    return (
      <div>
        <Table
          bordered
          dataSource={attrTable}
          rowKey={rowKey}
          columns={columns}
          scroll={{ x: 1300 }}
          locale={{
            emptyText: '已为您设置默认sku',
          }}
        />
        <Modal
          visible={levelVisible}
          onOk={this.modalOk}
          onCancel={this.handleCancelLevel}
          destroyOnClose="true"
        >
          <Form layout="horizontal" autoComplete="OFF">
            <Row gutter={24}>
              {/* <Col span={12}>
                <Form.Item label="一级">
                  {getFieldDecorator('one', {
                    initialValue: showData[0],
                    rules: [{ required: true, message: '请填写一级分佣值' }],
                  })(<InputNumber step={0.01} precision={2} min={0.01} max={totalPrice} />)}
                </Form.Item>
              </Col> */}
              {profitItem}
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
