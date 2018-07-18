import React, { Fragment } from 'react';
// import Particles from 'react-particles-js';
// import Particles from 'react-particles-js';
import CanvasNest from 'canvas-nest.js';
// import Particle from 'zhihu-particle';
import { Redirect, Switch, Route } from 'dva/router';
// Link,
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';
import AppNoMenu from '../components/utils/AppNoMenu';
// import { width } from 'window-size';
// import createCanvasNest from '../../public/canvas-nest';

// import createCanvasNest from '../../../public/canvas-nest'

// const links = [
//   {
//     key: 'help',
//     title: '帮助',
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: '隐私',
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: '条款',
//     href: '',
//   },
// ];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 风远科技
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // componentDidMount() {
  //   new Particle(this.background, {interactive: true, density: '1000', });
  // }
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    // new Particle(this.background, {interactive: true, density: 'low', particles: {}});
    const config = {
      color: '255,255,255',
      count: 60,
      zIndex: 1,
      opacity: 1,
    };
    // 在 element 地方使用 config 渲染效果
    const cn = new CanvasNest(this.myRef.current, config);
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '量子加能';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 量子加能`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container} ref={this.myRef}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img alt="logo" className={styles.logo} src="/logo/logo4.png" />
                {/* <Link to="/">
                  <img alt="logo" className={styles.logo} src='/logo/logo3.png' />
                </Link> */}
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter className={styles.bgColor} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default AppNoMenu(UserLayout);
