import { all } from 'redux-saga/effects';
import { watchUserSaga } from './userSaga';

export default function* rootSaga() {
  yield all([
    watchUserSaga(),
  ]);
}

