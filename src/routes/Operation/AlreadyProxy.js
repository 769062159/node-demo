import React from 'react';
import { Card, Transfer, Spin, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import AuthDialog from '../../components/AuthDialog';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const noop = function() {};

const RightAreaList = (() => {
  const SortableItem = SortableElement(({ item, checked, onSelect }) => (
    <li
      key={item.key}
      className="ant-transfer-list-content-item"
      style={{
        minHeight: '32px',
        padding: '6px 12px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        transition: 'all 0.3s',
        listStyle: 'none',
        boxSizing: 'border-box',
      }}
      title={item.title}
      onClick={() => onSelect(item.key, !checked)}
    >
      <Checkbox
        checked={checked}
        onChange={(event) => onSelect(item.key, event.target.checked)}
      >{item.title}
      </Checkbox>
    </li>
  ));

  return SortableContainer(({
    list,
    checkedKeys,
    onSelect,
  }) => (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {
        list.map((item, index) => (
          <SortableItem
            key={item.key}
            item={item}
            checked={checkedKeys.some(key => key === item.key)}
            onSelect={onSelect}
            index={index}
          />
        ))
      }
    </ul>
    ));
})();

@connect(({ operationAlreadyproxy: model, loading }) => ({
  model,
  centerList: model.centerList,
  centerObj: model.centerObj,
  centerLoading: model.centerLoading,
  targetKeys: model.targetKeys,
  loading: loading.models.operationAlreadyproxy,
}))
export default class AlreadyProxy extends React.Component {
  state = {
  }

  init = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationAlreadyproxy/doGetAlreadyProxyRegions',
      payload: {},
    });
    this.doGetCenterList();
  }

  onSaveRegion = () => {
    const { targetKeys, dispatch } = this.props;

    dispatch({
      type: 'operationAlreadyproxy/doSetAlreadyProxyRegions',
      payload: {
        params: targetKeys.map((item) => {
          const arr = item.split('-');
          return {
            id: arr[0],
            level: arr[1],
          }
        }),
      },
    });
  }

  onRightListSortEnd = ({oldIndex, newIndex}) => {
    const { targetKeys, dispatch } = this.props;

    newIndex = newIndex < 0 ? newIndex + targetKeys.length : newIndex;
    targetKeys.splice(newIndex, 0, targetKeys.splice(oldIndex, 1)[0]);
    dispatch({
      type: 'operationAlreadyproxy/setTargetKeys',
      payload: targetKeys,
    })
  }

  doGetCenterList = () => {
    const { centerObj, dispatch } = this.props;
    dispatch({
      type: 'operationAlreadyproxy/doGetCenterList',
      payload: {
        callback: noop,
        params: {
          page: centerObj.page + 1,
          pagesize: centerObj.pageSize,
        },
      },
    });
  }

  targetKeysOnChange = (targetKeys) => {
    const { dispatch } = this.props;
    console.log('targetKeys', targetKeys)
    dispatch({
      type: 'operationAlreadyproxy/setTargetKeys',
      payload: targetKeys,
    })
  }

  renderFooter = (props) => {
    const { centerObj } = this.props;
    if (props.direction === 'left' && centerObj.hasMore) {
      return (
        <Button
          type="default"
          onClick={this.doGetCenterList}
          style={{
            float: 'right',
            margin: 5,
          }}
          size="small"
        >加载更多
        </Button>
      );
    }
  }


  render() {
    const { props, state } = this;

    const { targetKeys, centerList, loading } = props;
    const rightList = targetKeys.map(key => centerList.find(item => item.key === key)).filter(item => item);

    return (
      <AuthDialog
        onAuth={this.init}
      >
        <PageHeaderLayout>

          <Card
            bordered={false}
          >
            <Spin spinning={loading}>


              <Transfer
                dataSource={centerList}
                targetKeys={targetKeys}
                footer={this.renderFooter}
                render={item => item.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                listStyle={{
                  flex: '1 1 auto',
                  height: 500,
                }}
                onChange={this.targetKeysOnChange}
              >
                {
                  ({ direction, onItemSelect, selectedKeys }) => {
                    if (direction === 'right') {
                      return (
                        <RightAreaList
                          list={rightList}
                          checkedKeys={selectedKeys}
                          onSelect={onItemSelect}
                          onSortEnd={this.onRightListSortEnd}
                          distance={5}
                        />
                      )
                    }
                  }
                }
              </Transfer>

              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={() => this.onSaveRegion()}
                >确认并保存
                </Button>
              </div>

            </Spin>
          </Card>
        </PageHeaderLayout>
      </AuthDialog>
    );
  }
}
