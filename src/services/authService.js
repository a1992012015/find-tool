import qs from 'qs';

import { defaultRequest, authRequest } from './requestService';

/**
 * 获取用户token
 * @param data
 * @returns {Promise}
 */
const getAuthTokenApi = data => {
  return authRequest.post('/oauth/token', qs.stringify(data), {
    headers: {
      'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });
};

/**
 * 获取用户信息
 * @returns {Promise}
 */
const getUserInfoApi = () => {
  return defaultRequest.get('/users');
};

export {
  getAuthTokenApi,
  getUserInfoApi,
};
