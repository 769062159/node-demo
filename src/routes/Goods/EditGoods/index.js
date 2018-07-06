import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from '../style.less';

import AppMenu from '../../../components/utils/AppMenu';

const { Step } = Steps;

class EditGood extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[3]) {
      // case 'info':
      //   return 0;
      case 'confirm':
        return 0;
      case 'result':
        return 1;
      default:
        return 0;
    }
  }
  render() {
    const { match, routerData } = this.props;
    const { id } = this.props.match.params;
    const url = `/good/edit-goods/confirm/${id}`;
    return (
      <PageHeaderLayout
        title="修改商品"
        // content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="修改商品详细信息" />
              <Step title="完成" />
            </Steps>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/good/edit-goods" to={url} />
              <Route render={NotFound} />
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AppMenu(EditGood);
