import React, { PureComponent } from 'react';
import { Table, Input, Icon, Popconfirm, Upload, Menu, Dropdown, Modal } from 'antd';

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
  };
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    if (this.props.onChange) {
      const { step } = this.props;
      let { value } = this.state;
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
    const { value } = this.state;
    return (
      <div className="editable-cell">
        <Input
          value={value}
          onChange={this.handleChange}
          onPressEnter={this.check}
          suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
        />
      </div>
    );
  }
}
class EditInput extends PureComponent {
  state = {
    value: this.props.value,
  };
  handleChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  render() {
    const { value } = this.state;
    return (
      <div className="editable-cell">
        <Input
          value={value}
          onChange={this.handleChange}
          onPressEnter={this.check}
          suffix={<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />}
        />
      </div>
    );
  }
}
class UploadImg extends PureComponent {
  state = {
    // value: this.props.value,
    previewVisible: false,
    previewImage: '',
    payload: {
      type: 2,
    },
    fileList: this.props.fileList,
    header: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  // componentWillReceiveProps(nextProps) {
  //   const { fileList } = this.props;
  //   const { fileList: nextfileList } = nextProps;
  //   if (fileList.length !== nextfileList.length) {
  //     this.setState({
  //       fileList: nextfileList,
  //     })
  //   }
  // }
  // componentWillUpdate(nextProps, nextState) {
  //   console.log(8888);
  //   console.log(nextState);
  //   // console.log(this.state.fileList);
  // }
  componentWillReceiveProps(nextProps) {
    console.log(111);
    console.log(nextProps);
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
      fileList.forEach(item => {
        console.log(item);
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
      });
    }
    this.setState({ fileList });
  };
  removeImg = () => {
    this.props.onChange([]);
  };
  render() {
    const { previewVisible, previewImage, payload, header, fileList } = this.state;
    console.log(99);
    console.log(fileList);
    console.log(this.props);
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
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      attrTable: props.attrTable,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      attrTable: nextProps.attrTable,
    });
  }

  onCellChange = (index, dataIndex) => {
    return value => {
      console.log(value);
      const attrTable = [...this.state.attrTable];
      attrTable[index][dataIndex] = value;
      this.setState({ attrTable });
      this.props.handleEmail(attrTable);
    };
  };
  onDelete = key => {
    const attrTable = [...this.state.attrTable];
    attrTable.splice(key, 1);
    this.props.handleEmail(attrTable);
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
  onClickMenu = (index, { key }) => {
    console.log(key);
    console.log(index);
    this.props.changeLevel(index, key);
  };
  render() {
    const { rowKey } = this.props;
    const { attrTable } = this.state;
    const menu = index => (
      <Menu onClick={this.onClickMenu.bind(this, index)}>
        <Menu.Item key="0">
          <span>一级</span>
        </Menu.Item>
        <Menu.Item key="1">
          <span>二级</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>三级</span>
        </Menu.Item>
        <Menu.Item key="3">
          <span>四级</span>
        </Menu.Item>
        <Menu.Item key="4">
          <span>五级</span>
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '图片',
        dataIndex: 'fileList',
        render: (text, record, index) => (
          <UploadImg fileList={text} onChange={this.onCellChange(index, 'fileList')} />
        ),
      },
      {
        title: 'SKUSN',
        dataIndex: 'goods_sku_sn',
        render: (text, record, index) => (
          <EditInput value={text} onChange={this.onCellChange(index, 'goods_sku_sn')} />
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
        title: '数量',
        dataIndex: 'store_nums',
        render: (text, record, index) => (
          <EditInputNumber
            value={text}
            step={0}
            onChange={this.onCellChange(index, 'store_nums')}
          />
        ),
      },
      {
        title: '等级',
        dataIndex: 'level',
        render: (text, record, index) => {
          return (
            <Dropdown overlay={menu(index)}>
              <a className="ant-dropdown-link">
                选择等级<Icon type="down" />
              </a>
            </Dropdown>
          );
        },
      },
      {
        title: '分佣值',
        dataIndex: 'profit_price',
        render: (text, record, index) => (
          <EditInputNumber value={text} step={2} onChange={this.onCellChange(index, 'price')} />
        ),
      },
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
    console.log(attrTable);
    // if (attrTable.length) {
    //   for (const key in attrTable[0]) {
    //     if (key !== 'count' && key !== 'price' && key !== 'AttrArrMap') {
    //       columns.unshift({
    //         title: 'sku属性',
    //         dataIndex: key,
    //         render: (text, record, index) => (
    //           <EditableCell value={text} onChange={this.onCellChange(index, key)} />
    //         ),
    //       });
    //     }
    //   }
    // }
    return (
      <div>
        <Table
          bordered
          dataSource={attrTable}
          rowKey={rowKey}
          columns={columns}
          scroll={{ x: 1300 }}
        />
      </div>
    );
  }
}
