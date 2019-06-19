import React from 'react';
import { Card, Tree, Transfer, Spin, Button } from 'antd';
import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { TreeNode } = Tree;

const noop = function() {};

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (
  treeNodes = [],
  checkedKeys = [],
  isLeaf = false,
) => {
  return treeNodes.map((item) => {
      return (
        <TreeNode
          key={item.key}
          title={item.title}
          dataRef={item}
          isLeaf={isLeaf}
          disabled={checkedKeys.some(key => key === item.key)}
        >
          {
            item.children ? generateTree(item.children, checkedKeys) : null
          }
        </TreeNode>
      );
    })
  };

function flattenDataSource(list = []) {
  let result = [];
  list.forEach(item => {
    result.push(item);
    if (item.children) {
      result = result.concat(flattenDataSource(item.children));
    }
  });
  return result;
}

const TreeTransfer = ({
  dataSource,
  transferDataSource,
  targetKeys,
  rightCheckedKeys,
  onRightCheckedKeysChange = noop,
  // 已经保存选择的数据（从后台获取）
  alreadyChosenList,
  onLeftLoadData,
  onRightTreeDrop,
  ...restProps
}) => {
  const allLeftTargetKeys = targetKeys;

  return (
    <Transfer
      {...restProps}
      targetKeys={allLeftTargetKeys}
      dataSource={transferDataSource}
      render={item => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...allLeftTargetKeys];
          const onCheck = (
            _,
            {
              node,
            },
          ) => {
            const eventKey = node.props.eventKey;
            if (eventKey === 'FORBIDDEN') return;
            onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
          };
          return (
            <Tree
              checkable
              blockNode
              checkStrictly
              checkedKeys={checkedKeys}
              loadData={onLeftLoadData}
              onCheck={onCheck}
              onSelect={onCheck}
            >
              {
                <TreeNode
                  key="FORBIDDEN"
                  title="已保存的选择"
                  checkable={false}
                >
                  {
                    generateTree(alreadyChosenList, allLeftTargetKeys, true)
                  }
                </TreeNode>
              }
              {generateTree(dataSource, allLeftTargetKeys)}
            </Tree>
          );
        } else {
          const checkedKeys = [...selectedKeys, ...rightCheckedKeys];

          const onCheck = (
            _,
            {
              node: {
                props: {
                  eventKey,
                },
              },
            }
          ) => {
            onRightCheckedKeysChange(eventKey, !isChecked(checkedKeys, eventKey));
            onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
          };

          return (
            <Tree
              checkable
              draggable
              blockNode
              checkStrictly
              checkedKeys={checkedKeys}
              onDrop={(info) => {
                if (!info.dropToGap) return;
                // 降落位置， 被拖拽的节点， 被降落的节点
                const { dropPosition, dragNode, node } = info;
                const copiedKeys = [...allLeftTargetKeys];
                const dragNodeIndex = copiedKeys.findIndex(key => dragNode.props.eventKey === key);
                const dragNodeValue = copiedKeys[dragNodeIndex];
                copiedKeys.splice(dragNodeIndex, 1);
                const nodeIndex = copiedKeys.findIndex(key => node.props.eventKey === key);
                // 放置在被降落节点的前方
                if (dropPosition === nodeIndex - 1) {
                  copiedKeys.splice(nodeIndex, 0, dragNodeValue);
                } else {
                // 放置在被降落节点的后方
                  copiedKeys.splice(nodeIndex + 1, 0, dragNodeValue);
                }
                onRightTreeDrop(copiedKeys);
              }}
              onCheck={onCheck}
              onSelect={onCheck}
            >
              {
                allLeftTargetKeys
                  .map(key => {
                    const item = transferDataSource.find(item => key === item.key);
                    return item;
                  })
                  .map(
                    (item) => (
                      <TreeNode
                        title={item.title}
                        key={item.key}
                        dataRef={item}
                        checked={isChecked(checkedKeys, item.key)}
                      />
                    )
                  )
              }
            </Tree>
          )
        }
      }}
    </Transfer>
  );
};

@connect(({ operationAlreadyproxy, loading }) => ({
  operationAlreadyproxy,
  regionTree: operationAlreadyproxy.regionTree,
  userChosen: operationAlreadyproxy.userChosen,
  loading: loading.models.operationAlreadyproxy,
}))
export default class AlreadyProxy extends React.Component {
  state = {
    // 左边的Key
    targetKeys: [],
    // 右边的Key
    rightCheckedKeys: [],
  };

  componentDidMount = () => {
    this.getRegionList({}, {});
    const { dispatch } = this.props;
    dispatch({
      type: 'operationAlreadyproxy/doGetAlreadyProxyRegions',
      payload: {},
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.userChosen !== this.props.userChosen) {
      this.setState({
        targetKeys: nextProps.userChosen.map(item => item.key),
      });
    }
  }

  onChange = (targetKeys, direction, moveKeys) => {
    let { rightCheckedKeys } = this.state;
    if (direction === 'left') {
      rightCheckedKeys = rightCheckedKeys.filter(key => !(moveKeys.some(mKey => mKey === key)));
    }

    this.setState({
      targetKeys,
      rightCheckedKeys,
    });
  }

  onRightCheckedKeysChange = (cKey, checked) => {
    let { rightCheckedKeys } = this.state;
    if (checked) {
      rightCheckedKeys = [...rightCheckedKeys, cKey];
    } else {
      rightCheckedKeys = rightCheckedKeys.filter(key => key !== cKey);
    }
    this.setState({
      rightCheckedKeys,
    });
  }

  onLeftLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const { level, id } = treeNode.props.dataRef;
      if (level === 4) {
        resolve();
        return;
      }
      this.getRegionList({
        id,
        type: level + 1,
      }, {
        regionRef: treeNode.props.dataRef,
        callback: () => resolve(),
      });
    });
  }

  onSaveRegion = (allDataSource) => {
    const { dispatch } = this.props;
    const { targetKeys } = this.state;
    const selectedItems = targetKeys.map(key => allDataSource.find(item => item.key === key));
    dispatch({
      type: 'operationAlreadyproxy/doSetAlreadyProxyRegions',
      payload: {
        params: selectedItems.map(item => ({
          id: item.id,
          level: item.level,
        })),
        userChosen: selectedItems,
      },
    });
  }

  onRightTreeDrop = (draggedKeys) => {
    this.setState({
      targetKeys: draggedKeys,
    });
  }

  getRegionList = ({
    id = 0,
    type = 1,
  }, {
    regionRef = [],
    callback = noop,
  }) => {
    const { dispatch, regionTree } = this.props;
    dispatch({
      type: 'operationAlreadyproxy/doGetRegionList',
      payload: {
        data: {id, type},
        regionTree,
        regionRef,
        callback,
      },
    });
  }

  render() {
    const { props, state } = this;
    const flattenedSource = flattenDataSource(props.regionTree);
    const transferDataSource = flattenedSource.concat(
      props.userChosen.filter(
        (alItem) =>
          !flattenedSource.some(fs => fs.id === alItem.id)
      )
    );

    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
        >
          <Spin spinning={props.loading}>
            <TreeTransfer
              dataSource={props.regionTree}
              transferDataSource={transferDataSource}
              targetKeys={state.targetKeys}
              rightCheckedKeys={state.rightCheckedKeys}
              alreadyChosenList={props.userChosen}
              listStyle={{
                maxHeight: '500px',
                overflow: 'auto',
              }}
              titles={['所有区域', '已选（可拖拽排序）']}
              onChange={this.onChange}
              onRightCheckedKeysChange={this.onRightCheckedKeysChange}
              onLeftLoadData={this.onLeftLoadData}
              onRightTreeDrop={this.onRightTreeDrop}
            />

            <div style={{marginTop: '15px', textAlign: 'right'}}>
              <Button
                type="primary"
                onClick={() => this.onSaveRegion(transferDataSource)}
              >确认并保存
              </Button>
            </div>

          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
