import React from 'react';
import { Table, Input, Icon, Popconfirm } from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = e => {
    const value = e.target.value;
    // console.log(value);
    // console.log(this.state);
    // console.log(this.props);
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

export default class EditableTable extends React.Component {
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
      const attrTable = [...this.state.attrTable];
      attrTable[index][dataIndex] = value;
      this.setState({ attrTable });
      this.props.handleEmail(attrTable);
      // const target = attrTable.find(item => item.key === key);
      // if (target) {
      // target[dataIndex] = value;
      // this.setState({ attrTable });
      // }
    };
  };
  onDelete = key => {
    console.log(key);
    const attrTable = [...this.state.attrTable];
    attrTable.splice(key, 1);
    console.log(attrTable);
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
  render() {
    const { rowKey, tableHeader } = this.props;
    const { attrTable } = this.state;
    console.log(attrTable);

    const columns = [
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record, index) => {
          return (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
              <a href="">Delete</a>
            </Popconfirm>
          );
        },
      },
    ];
    console.log(attrTable);
    if (attrTable.length) {
      for (const key in attrTable[0]) {
        if (key !== 'count' && key !== 'price' && key !== 'AttrArrMap') {
          columns.unshift({
            title: tableHeader[key],
            dataIndex: key,
            render: (text, record, index) => (
              <EditableCell value={text} onChange={this.onCellChange(index, key)} />
            ),
          });
        }
      }
    }
    return (
      <div>
        <Table bordered dataSource={attrTable} rowKey={rowKey} columns={columns} />
      </div>
    );
  }
}
