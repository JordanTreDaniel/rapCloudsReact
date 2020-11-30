import { cancel, put, takeEvery, call, select } from 'redux-saga/effects';
import { SET_HYDRATION_TRUE, UPDATE_USER } from '../actionTypes';
import axios from 'axios';
import { getUser } from '../selectors';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';
function* setHydrationTrue() {
	yield put({ type: SET_HYDRATION_TRUE });
}

function* watchSetHydrationTrue(action) {
	yield takeEvery('persist/REHYDRATE', setHydrationTrue);
}

const apiUpdateUser = async (user) => {
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/users/updateUser`,
		data: { user },
	});
	const { status, statusText, data } = res;
	user = data.user;
	if (status === 200) {
		return { user };
	}

	return { error: { status, statusText } };
};

function* updateUser(action) {
	const { userUpdates } = action;
	if (!userUpdates) {
		yield put({ type: UPDATE_USER.cancellation, message: 'No user included' });
		return yield cancel();
	}
	const user = yield select(getUser);
	const { user: newUser, error } = yield call(apiUpdateUser, { ...user, ...userUpdates });
	if (!error) {
		yield put({ type: UPDATE_USER.success, user: newUser });
		return newUser;
	} else {
		yield put({ type: UPDATE_USER.failure, error });
		return error;
	}
}

function* watchUpdateUser(action) {
	yield takeEvery(UPDATE_USER.start, updateUser);
}

export default [ watchSetHydrationTrue, watchUpdateUser ];
