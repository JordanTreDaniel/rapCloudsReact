import { put, takeEvery } from "redux-saga/effects";
import { FETCH_USER, SET_USER } from "../actionTypes";

// Our worker Saga: will perform the async increment task
export function* fetchUser(action) {
  console.log("fetch user", action);
  yield put({ type: SET_USER });
}

// Our watcher Saga: spawn a new fetchUser task on each INCREMENT_ASYNC
export default function* watchFetchUser(action) {
  yield takeEvery(FETCH_USER, fetchUser);
}
