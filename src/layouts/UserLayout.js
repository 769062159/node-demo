import React, { Fragment } from 'react';
// import Particles from 'react-particles-js';
import Particles from 'react-particles-js';
// import Particle from 'zhihu-particle';
import { Link, Redirect, Switch, Route } from 'dva/router';
// Link,
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
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
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '3.14';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    const app = {
      particles: {
        line_linked: {
          shadow: {
            enable: true,
            color: '#3CA9D1',
            blur: 5,
          },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'bubble',
          },
          onclick: {
            enable: true,
            mode: 'repulse',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    };
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Particles
            params={app}
            style={{
              width: '100%',
              backgroundImage: `url(../../public/loginbg.jpg)`,
            }}
          />
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header} style={{ visibility: 'hidden' }}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo} />
                    <span className={styles.title}>Ant Design</span>
                  </Link>
                </div>
                <div className={styles.desc} style={{ visibility: 'hidden' }}>
                  Ant Design 是西湖区最具影响力的 Web 设计规范
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
          {/* links={links} */}
        </div>
      </DocumentTitle>
    );
  }
}

export default AppNoMenu(UserLayout);
