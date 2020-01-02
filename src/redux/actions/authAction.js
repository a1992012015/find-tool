import {
  AUTH_CLEAN_INFO,
  AUTH_ERROR,
  AUTH_GET_INFO,
  AUTH_SAVE_INFO,
  AUTH_SAVE_LOADING,
  AUTH_SAVE_TOKEN,
  AUTH_SIGN_IN,
  AUTH_SIGN_OUT,
  AUTH_UPDATE_USER,
} from '../actionTypes/authType';

const signInAction = (values) => {
  return {
    type: AUTH_SIGN_IN,
    payload: {
      password: values.password,
      username: values.username,
      grant_type: 'password',
    },
  };
};

const getUserInfoAction = () => {
  return {
    type: AUTH_GET_INFO,
  };
};

const signOutActon = () => {
  return {
    type: AUTH_SIGN_OUT,
  };
};

const authErrorAction = () => {
  return {
    type: AUTH_ERROR,
  };
};

const cleanAuthAction = () => {
  return {
    type: AUTH_CLEAN_INFO,
  };
};

const saveTokenAction = (tokens) => {
  return {
    type: AUTH_SAVE_TOKEN,
    token: tokens,
  };
};

const saveInfoAction = (userInfo) => {
  return {
    type: AUTH_SAVE_INFO,
    userInfo: userInfo,
  };
};

const updateUserAction = () => {
  return {
    type: AUTH_UPDATE_USER,
  };
};

const saveLoadingAction = (key) => {
  return {
    type: AUTH_SAVE_LOADING,
    key: key,
  };
};

export {
  signInAction,
  getUserInfoAction,
  signOutActon,
  authErrorAction,
  cleanAuthAction,
  saveTokenAction,
  saveLoadingAction,
  updateUserAction,
  saveInfoAction,
};
