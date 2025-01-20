import { call, put, takeLatest } from 'redux-saga/effects';
import { userApi } from '../api/userApi';
import { setUsers, addUser, updateUser, patchUser, deleteUser } from '../store/userSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

function* fetchUsersSaga() {
  try {
    const users: User[] = yield call(userApi.getUsers);
    yield put(setUsers(users));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

function* addUserSaga(action: PayloadAction<Omit<User, 'id'>>) {
  try {
    const newUser: User = yield call(userApi.addUser, action.payload);
    yield put(addUser(newUser));
  } catch (error) {
    console.error('Failed to add user:', error);
  }
}

function* updateUserSaga(action: PayloadAction<User>) {
  try {
    const updatedUser: User = yield call(userApi.updateUser, action.payload);
    yield put(updateUser(updatedUser));
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

function* patchUserSaga(action: PayloadAction<{ id: number; partialUser: Partial<User> }>) {
  try {
    const patchedUser: User = yield call(userApi.patchUser, action.payload.id, action.payload.partialUser);
    yield put(patchUser(patchedUser));
  } catch (error) {
    console.error('Failed to patch user:', error);
  }
}

function* deleteUserSaga(action: PayloadAction<number>) {
  try {
    yield call(userApi.deleteUser, action.payload);
    yield put(deleteUser(action.payload));
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
}

export function* watchUserSaga() {
  yield takeLatest('users/fetchUsersSaga', fetchUsersSaga);
  yield takeLatest('users/addUserSaga', addUserSaga);
  yield takeLatest('users/updateUserSaga', updateUserSaga);
  yield takeLatest('users/patchUserSaga', patchUserSaga);
  yield takeLatest('users/deleteUserSaga', deleteUserSaga);
}

