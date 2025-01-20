import { call, put, takeLatest } from 'redux-saga/effects';
import { userApi } from '../api/userApi';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserDetailsStart,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
} from '../store/userSagaSlice';
import { User, UserDetails } from '../types/User';

function* fetchUsersSaga() {
  try {
    const users: User[] = yield call(userApi.getUsers);
    yield put(fetchUsersSuccess(users));
  } catch (error) {
    yield put(fetchUsersFailure('Failed to fetch users'));
  }
}

function* fetchUserDetailsSaga(action: ReturnType<typeof fetchUserDetailsStart>) {
  try {
    const userId = action.payload;
    const user: User = yield call(userApi.getUserById, userId);
    const posts = yield call(userApi.getUserPosts, userId);
    const commentsPromises = posts.slice(0, 3).map((post: any) => call(userApi.getPostComments, post.id));
    const commentsArrays = yield call([Promise, Promise.all], commentsPromises);
    const comments = commentsArrays.flat();

    const userDetails: UserDetails = { user, posts, comments };
    yield put(fetchUserDetailsSuccess(userDetails));
  } catch (error) {
    yield put(fetchUserDetailsFailure('Failed to fetch user details'));
  }
}

export function* watchUserSaga() {
  yield takeLatest(fetchUsersStart.type, fetchUsersSaga);
  yield takeLatest(fetchUserDetailsStart.type, fetchUserDetailsSaga);
}

