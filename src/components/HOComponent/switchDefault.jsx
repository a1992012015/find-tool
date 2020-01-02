import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { pathToRegexp } from 'path-to-regexp';

import { loadable } from './loadable';
import { wrap } from './wrap';
import { routerTransition, transitionList } from '../../configs/routerTransitionConfig';
import { BaseComponent } from '../../baseClass/ShouldComponentUpdate';

const Error = loadable(() => import('../../pages/Error/Error'));

/**
 * 默认路由跳转，添加路由跳转动画
 */
export class SwitchDefault extends BaseComponent {
  oldLocation = null;

  getSceneConfig = (location) => {
    const routerName = Object.keys(routerTransition).find((key) => {
      return pathToRegexp(key).test(location.pathname);
    });

    return transitionList[routerTransition[routerName] || 0];
  };

  getClassName = () => {
    const { history } = this.props;

    // 转场动画应该都是采用当前页面的routerTransition，所以：
    // push操作时，用新location匹配的路由
    // pop操作时，用旧location匹配的路由
    let classNames = '';
    if (history.action === 'PUSH') {
      classNames = `forward-${this.getSceneConfig(history.location).enter}`;
    } else if (history.action === 'POP' && this.oldLocation) {
      classNames = `back-${this.getSceneConfig(this.oldLocation).exit}`;
    }

    // 更新旧location
    this.oldLocation = history.location;

    return classNames;
  };

  render() {
    const { history: { location }, children } = this.props;
    const classNames = this.getClassName();
    return (
      <TransitionGroup
        className='wrap-transition'
        childFactory={child => React.cloneElement(child, { classNames })}
      >
        <CSSTransition
          key={location.pathname}
          timeout={500}
          appear={true}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <Switch location={location}>
            {children}
            <Route path='*' component={wrap(Error)}/>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
