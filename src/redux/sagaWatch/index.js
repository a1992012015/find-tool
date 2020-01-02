import { all } from 'redux-saga/effects';

import { authSaga } from './authSaga';

export function* rootSaga() {
  yield all([
    ...authSaga,
  ]);
}
