import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Icon, Menu } from 'antd';
import { hot } from 'react-hot-loader';

import { homeMenu } from './configs/homeMenuConfig';
import { loadable } from './components/HOComponent/loadable';
import { wrap } from './components/HOComponent/wrap';
import { SwitchDefault } from './components/HOComponent/switchDefault';
import { BaseComponent } from './baseClass/ShouldComponentUpdate';

import styles from './App.module.scss';

const FindSeed = loadable(() => import('./pages/FindSeed/FindSeed'));

const IndividualValues = loadable(() => import('./pages/IndividualValues/IndividualValues'));

const PokemonDen = loadable(() => import('./pages/PokemonDen/PokemonDen'));

class App extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultPath: this.getRouterPath(),
    };
  }

  handleClick = (path) => {
    const { history } = this.props;
    history.push({ pathname: path.key });
  };

  getRouterPath = () => {
    const { location } = this.props;
    const path = homeMenu.filter(i => location.pathname.includes(i.key));
    return path.length ? path[0].key : homeMenu[0].key;
  };

  render() {
    const { defaultPath } = this.state;
    const { history } = this.props;
    return (
      <div className={styles.App}>
        <Menu
          onClick={this.handleClick}
          className={styles.AppMenu}
          defaultSelectedKeys={defaultPath}
          mode='horizontal'
        >
          {this.renderHomeMenu()}
        </Menu>

        <SwitchDefault history={history}>
          <Route exact={true} path='/find-seed' component={wrap(FindSeed)}/>
          <Route exact={true} path='/individual-values' component={wrap(IndividualValues)}/>
          <Route exact={true} path='/pokémon-den' component={wrap(PokemonDen)}/>
          <Redirect exact={true} from='/' to='/find-seed'/>
        </SwitchDefault>
      </div>
    );
  }

  renderHomeMenu = () => {
    return homeMenu.map((menu) => {
      return (
        <Menu.Item key={menu.key}>
          <Icon type={menu.icon}/>
          {menu.name}
        </Menu.Item>
      );
    });
  };
}

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
