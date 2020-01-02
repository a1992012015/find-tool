import axios from 'axios';
import qs from 'qs';
import { fromJS } from 'immutable';

import { environment } from '../environments';
import { authErrorAction, saveTokenAction } from '../redux/actions/authAction';

let isRefreshing = false;
let refreshSubscribers = [];

const defaultRequest = axios.create({
  baseURL: environment.mallApi,
  timeout: 60000,
});

const authRequest = axios.create({
  baseURL: environment.authApi,
  timeout: 60000,
});

/**
 * 刷新用户token
 * @param refreshToken
 * @returns {Promise}
 */
const refreshTokenApi = (refreshToken) => {
  return authRequest.post('/oauth/token', qs.stringify({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }), {
    headers: {
      'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });
};

const errorHandleRefreshToken = (getState, dispatch, errors) => {
  const { response: { config } } = errors;
  const { auth } = getState();
  const refreshToken = auth.getIn(['tokens', 'refresh_token']);
  if (!isRefreshing && refreshToken) {
    isRefreshing = true;
    refreshTokenApi(refreshToken).then((response) => {
      isRefreshing = false;
      dispatch(saveTokenAction(response));
      const subscribers = [...refreshSubscribers];
      subscribers.map(cb => cb());
      refreshSubscribers = [];
    }).catch(() => {
      dispatch(authErrorAction());
      refreshSubscribers = [];
    });
  } else {
    return Promise.reject(fromJS(errors || {}));
  }

  return new Promise((resolve, reject) => {
    refreshSubscribers.push(() => {
      // replace the expired token and retry
      return defaultRequest(config).then(
        (response) => resolve(fromJS(response || {})),
        (error) => reject(fromJS(error || {})),
      );
    });
  });
};

const middlewareOptions = [
  {
    client: defaultRequest,
    interceptors: {
      request: [
        {
          success: ({ getState }, request) => {
            const { auth } = getState();
            const accessToken = auth.getIn(['tokens', 'access_token']);
            const tokenType = auth.getIn(['tokens', 'token_type']);
            if (accessToken) {
              return {
                ...request,
                headers: {
                  ...(request.headers || {}),
                  Authorization: `${tokenType} ${accessToken}`,
                },
              };
            }
            return request;
          },
          error: (store, error) => {
            return Promise.reject(fromJS(error || {}));
          },
        },
      ],
      response: [
        {
          success: function(store, response) {
            return Promise.resolve(fromJS(response.data || {}));
          },
          error: function({ getState, dispatch }, error) {
            const { response } = error;
            if (response && response.status === 401) {
              return errorHandleRefreshToken(getState, dispatch, error);
            }
            return Promise.reject(fromJS(error || {}));
          },
        },
      ],
    },
  },
  {
    client: authRequest,
    interceptors: {
      request: [
        {
          success: (store, request) => {
            return request;
          },
          error: (store, error) => {
            return Promise.reject(fromJS(error || {}));
          },
        },
      ],
      response: [
        {
          success: function(store, response) {
            return Promise.resolve(fromJS(response.data || {}));
          },
          error: function(store, error) {
            return Promise.reject(fromJS(error || {}));
          },
        },
      ],
    },
  },
];

export {
  defaultRequest,
  authRequest,
  middlewareOptions,
};
