import { call, select, takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';
import { getCloudSettingsForFlight } from '../selectors';
import { FETCH_MASKS, ADD_CUSTOM_MASK } from '../actionTypes';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiFetchWordCloud = async (lyricString, cloudSettings) => {
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/makeWordCloud`,
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
		data: {
			lyricString,
			cloudSettings,
		},
	});

	const { status, statusText, data } = res;

	if (status === 200) {
		return { data: data.data, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* fetchWordCloud(action) {
	try {
		const cloudSettings = yield select(getCloudSettingsForFlight);
		const { lyricString } = action;
		// console.log('Fetch cloud', { cloudSettings, lyricString });
		if (!lyricString || !lyricString.length) return { error: { message: 'Must include lyrics to get a cloud' } };
		const { data, error } = yield call(apiFetchWordCloud, lyricString, cloudSettings);
		const { encodedCloud } = data;
		if (error) {
			console.log('Something went wrong in fetchWordCloud', error);
			return { error };
		} else {
			return { encodedCloud };
		}
	} catch (err) {
		console.log('Something went wrong', err);
		return { error: err };
	}
}

const apiFetchMasks = async () => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/masks`,
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
	});
	const { status, statusText, data } = res;
	const { masks } = data;
	if (status === 200) {
		return { masks, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* fetchMasks(action) {
	try {
		const { masks, error } = yield call(apiFetchMasks);
		if (error) {
			console.log('Something went wrong in fetchMasks', error);
			return { error };
		} else {
			yield put({ type: FETCH_MASKS.success, masks });
			return { masks };
		}
	} catch (err) {
		console.log('Something went wrong', err);
		yield put({ type: FETCH_MASKS.failure, err });
		return { error: err };
	}
}

function* watchFetchMasks() {
	yield takeLatest(FETCH_MASKS.start, fetchMasks);
}

const apiAddCustomMask = async (newMask, userId) => {
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/addMask`,
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
		data: {
			newMask,
			userId,
		},
	});
	const { status, statusText, data } = res;
	const { mask } = data;
	if (status === 200) {
		return { mask, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* addCustomMask(action) {
	const { newMask } = action;
	const { userId } = newMask || {};
	if (!newMask || !userId) {
		yield put({ type: ADD_CUSTOM_MASK.cancellation });
	}
	try {
		const { mask, error } = yield call(apiAddCustomMask, newMask, userId);
		if (error) {
			console.log('Something went wrong in fetchMasks', error);
			return { error };
		} else {
			yield put({ type: ADD_CUSTOM_MASK.success, mask });
			return { mask };
		}
	} catch (err) {
		console.log('Something went wrong', err);
		yield put({ type: ADD_CUSTOM_MASK.failure, err });
		return { error: err };
	}
}

function* watchAddCustomMask() {
	yield takeLatest(ADD_CUSTOM_MASK.start, addCustomMask);
}
export default [ watchFetchMasks, watchAddCustomMask ];
