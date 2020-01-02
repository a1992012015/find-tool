import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import {
  getUserInfoAction,
  signInAction,
  signOutActon,
  updateUserAction,
} from '../../redux/actions/authAction';
import { BaseComponent } from '../../baseClass/ShouldComponentUpdate';

import styles from './Home.module.scss';

class Home extends BaseComponent {
  componentDidMount() {
    const { auth, getUserInfoDispatch } = this.props;
    if (auth.getIn(['tokens', 'access_token'])) {
      getUserInfoDispatch();
    }
  }

  userSignIn = () => {
    const { signInDispatch } = this.props;
    signInDispatch({
      password: '123456',
      username: '15982086412',
    });
  };

  getUserInfo = () => {
    const { updateUserDispatch } = this.props;
    updateUserDispatch();
  };

  userSignOut = () => {
    const { signOutDispatch } = this.props;
    signOutDispatch();
  };

  render() {
    const { auth } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.status}>
          {
            auth.get('loading') ? (
              '登录中。。。'
            ) : !auth.get('tokens') ? (
              <Button className={styles.statusBtn} onClick={this.userSignIn}>登录</Button>
            ) : (
              <Fragment>
                <Button className={styles.statusBtn} onClick={this.userSignOut}>退出</Button>
                {
                  auth.get('infoLoading') ? '获取用户信息。。。' : (
                    <Button className={styles.statusBtn} onClick={this.getUserInfo}>获取用户信息</Button>
                  )
                }
              </Fragment>
            )
          }
        </div>

        <p>username: {auth.getIn(['userInfo', 'username'])}</p>
        <p>phone: {auth.getIn(['userInfo', 'phone'])}</p>
        <p>access token: {auth.getIn(['tokens', 'access_token'])}</p>
        <p>refresh token: {auth.getIn(['tokens', 'refresh_token'])}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  signInDispatch: signInAction,
  signOutDispatch: signOutActon,
  getUserInfoDispatch: getUserInfoAction,
  updateUserDispatch: updateUserAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
