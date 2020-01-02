import { Map } from 'immutable';

import {
  AUTH_CLEAN_INFO,
  AUTH_SAVE_INFO,
  AUTH_SAVE_LOADING,
  AUTH_SAVE_TOKEN,
} from '../actionTypes/authType';

const authInit = Map({
  loading: false,
  infoLoading: false,
  userInfo: null,
  tokens: null,
});

export function authReducer(state = authInit, action) {
  switch (action.type) {
  case AUTH_SAVE_INFO:
    return state.set('userInfo', action.userInfo).set('loading', false).set('infoLoading', false);
  case AUTH_SAVE_TOKEN:
    return state.set('tokens', action.token).set('loading', false);
  case AUTH_CLEAN_INFO:
    return authInit;
  case AUTH_SAVE_LOADING:
    return state.set(action.key, true);
  default:
    return state;
  }
}
