import { takeEvery, take, put, fork, call, cancel } from 'redux-saga/effects';

import {
  AUTH_ERROR,
  AUTH_GET_INFO,
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  AUTH_UPDATE_USER,
} from '../actionTypes/authType';
import { getAuthTokenApi, getUserInfoApi } from '../../services/authService';
import {
  saveTokenAction,
  saveInfoAction,
  cleanAuthAction,
  authErrorAction,
  saveLoadingAction,
} from '../actions/authAction';

function* getTokenWork(payload) {
  try {
    const tokens = yield call(getAuthTokenApi, payload);
    yield put(saveTokenAction(tokens));
    yield call(getUserInfoWork);
  } catch (e) {
    // TODO 获取token的错误处理
    console.error('getTokenWork error', e);
  }
}

function* getUserInfoWork() {
  try {
    yield put(saveLoadingAction('infoLoading'));
    const userInfo = yield call(getUserInfoApi);
    yield put(saveInfoAction(userInfo));
  } catch (e) {
    // TODO 获取用户信息的错误处理
    console.error('getUserInfoWork error', e);
  }
}

function* authErrorWork() {
  yield put(cleanAuthAction());
}

function* signInWatch() {
  while (true) {
    const { type, payload } = yield take([AUTH_SIGN_IN, AUTH_GET_INFO]);
    yield put(saveLoadingAction('loading'));
    let task = null;
    if (type === AUTH_GET_INFO) {
      task = yield fork(getUserInfoWork);
    } else {
      task = yield fork(getTokenWork, payload);
    }
    const action = yield take([AUTH_SIGN_OUT, AUTH_ERROR]);
    if (action.type === AUTH_SIGN_OUT) {
      yield cancel(task);
    }
    yield put(authErrorAction());
  }
}

function* updateUserWatch() {
  yield takeEvery(AUTH_UPDATE_USER, getUserInfoWork);
}

function* authErrorWatch() {
  yield takeEvery(AUTH_ERROR, authErrorWork);
}

export const authSaga = [
  signInWatch(),
  authErrorWatch(),
  updateUserWatch(),
];
