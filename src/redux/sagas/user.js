import { put, takeEvery } from 'redux-saga/effects';
import { SET_HYDRATION_TRUE } from '../actionTypes';

function* setHydrationTrue() {
	yield put({ type: SET_HYDRATION_TRUE });
}

function* watchSetHydrationTrue(action) {
	yield takeEvery('persist/REHYDRATE', setHydrationTrue);
}

export default [ watchSetHydrationTrue ];
