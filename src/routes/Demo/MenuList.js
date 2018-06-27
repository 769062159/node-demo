import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Modal, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import './style.less';

const ButtonGroup = Button.Group;
const { confirm } = Modal;
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/fetchMenu'],
}))
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: 1,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchMenu',
    });
    this.updataData();
  }
  // 更新
  // update = () => {
  //   this.setState((prevState, props) => ({
  //     menuList: props.menu.data,
  //   }));
  // };
  // 刷新本页
  updataData = () => {
    const { pagination } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchMenu',
      payload: {
        status: 0,
        page: pagination,
      },
    });
  };

  showDeleteConfirm = id => {
    const that = this;
    confirm({
      content: '你确定删除这个吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'menu/delMenu',
          payload: {
            id,
          },
        }).then(() => {
          that.updataData();
        });
        // that.setState({
        //   dataSource: DelDataSource,
        // });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 换页
  handleTableChange = pagination => {
    this.setState({
      pagination: pagination.current,
    });
  };
  // 跳到角色
  goPath = () => {
    const { dispatch } = this.props;
    const url = `/router/menu-add`;
    dispatch(routerRedux.push(url));
  };
  render() {
    // const { menuList } = this.state;
    // console.log(this.props);
    // const { menu: { data: menuList } } =
    const { loading, menu: { data: menuList } } = this.props;
    const progressColumns = [
      {
        title: '',
        dataIndex: '',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'menu_name',
        key: 'menu_name',
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          return (
            <ButtonGroup>
              <Button data-index={index} onClick={this.showDeleteConfirm.bind(this, record.id)}>
                删除
              </Button>
            </ButtonGroup>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="菜单列表">
        <Card bordered={false}>
          <Button type="primary" onClick={this.goPath} style={{ marginBottom: 24 }}>
            新增菜单
          </Button>
          <Table
            onChange={this.handleTableChange}
            dataSource={menuList}
            rowKey={record => record.id}
            loading={loading}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
