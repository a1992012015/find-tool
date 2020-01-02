import { combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router/immutable';

import { authReducer } from './authReducer';

const history = createBrowserHistory();

/**
 * Create a reducer creator for potential additional reducer key/value pairs
 * @param reducers Reducers map
 * @return function(*=): * creator
 */
const createReducerCreator = (reducers) => {
  return (extraReducers = {}) => {
    return combineReducers(
      Object.assign(
        {
          router: connectRouter(history),
        },
        reducers,
        extraReducers,
      ),
    );
  };
};

const combineReducer = createReducerCreator({
  auth: authReducer,
});

export {
  combineReducer,
  history,
};
