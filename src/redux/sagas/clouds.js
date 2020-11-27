import { call, select, takeLatest, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { getCloudSettingsForFlight, getUserMongoId } from '../selectors';
import { FETCH_MASKS, ADD_CUSTOM_MASK, DELETE_MASK, FETCH_CLOUDS } from '../actionTypes';
import { listRapClouds } from '../../graphql/queries';
import { createRapCloud } from '../../graphql/mutations';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { getAwsUserEmail } from '../../utils';
const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiGenerateCloud = async (lyricString, cloudSettingsForFlight) => {
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
			cloudSettings: cloudSettingsForFlight,
		},
	});

	const { status, statusText, data } = res;

	if (status === 200) {
		return { data: data.data, status, statusText };
	}

	return { error: { status, statusText } };
};

const apiSaveCloud = async (cloud) => {
	try {
		const cloudData = await API.graphql(graphqlOperation(createRapCloud, { input: cloud }));
		return cloudData.data.createRapCloud;
	} catch (err) {
		console.error("Couldn't save the cloud", { cloud, err });
	}
};

export function* generateCloud(action) {
	try {
		let { lyricString, cloud } = action;
		if (!lyricString || !lyricString.length) return { error: { message: 'Must include lyrics to get a cloud' } };
		const cloudSettingsForFlight = yield select(getCloudSettingsForFlight);
		const awsUserEmail = yield call(getAwsUserEmail);
		cloud = {
			...cloud,
			userEmail: awsUserEmail,
			settings: cloudSettingsForFlight,
		};
		const { data, error } = yield call(apiGenerateCloud, lyricString, cloudSettingsForFlight);
		const { encodedCloud } = data;
		if (error) {
			console.log('Something went wrong in generateCloud', error);
			return { error };
		} else {
			cloud = yield call(apiSaveCloud, cloud);
			return { finishedCloud: { ...cloud, encodedCloud } };
		}
	} catch (err) {
		console.log('Something went wrong', err);
		return { error: err };
	}
}

const apiFetchMasks = async (userId) => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/masks/${userId}`,
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
		const userId = yield select(getUserMongoId);
		const { masks, error } = yield call(apiFetchMasks, userId);
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
	yield takeEvery(ADD_CUSTOM_MASK.start, addCustomMask);
}

const apiDeleteMask = async (maskId) => {
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/deleteMask`,
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
		data: {
			maskId,
		},
	});
	const { status, statusText, data } = res;
	const { message } = data;
	if (status === 200) {
		return { message };
	}

	return { error: { status, statusText } };
};

export function* deleteMask(action) {
	const { maskId } = action;
	const userId = yield select(getUserMongoId);
	if (!maskId || !userId) {
		yield put({ type: DELETE_MASK.cancellation });
	}
	try {
		const { error } = yield call(apiDeleteMask, maskId);
		if (error) {
			console.log('Something went wrong in fetchMasks', error);
			return { error };
		} else {
			yield put({ type: DELETE_MASK.success, maskId });
			yield put({ type: FETCH_MASKS.start });
			return maskId;
		}
	} catch (err) {
		console.log('Something went wrong', err);
		yield put({ type: DELETE_MASK.failure, err });
		return { error: err };
	}
}

function* watchDeleteMask() {
	yield takeEvery(DELETE_MASK.start, deleteMask);
}

const apiFetchClouds = async () => {
	try {
		const cUI = await Auth.currentUserInfo();
		console.log('Currnet user?', cUI);
		const cloudsData = await API.graphql(graphqlOperation(listRapClouds));
		const cloudsList = cloudsData.data.listRapClouds.items;
		return { cloudsList };
	} catch (error) {
		console.log('error on fetching songs', error);
		return { error };
	}
};

export function* fetchClouds(action) {
	try {
		const { cloudsList, error } = yield call(apiFetchClouds);
		if (error) {
			console.log('Something went wrong in fetchMasks', error);
			return { error };
		} else {
			yield put({ type: FETCH_CLOUDS.success, cloudsList });
			return { cloudsList };
		}
	} catch (err) {
		console.log('Something went wrong', err);
		yield put({ type: FETCH_CLOUDS.failure, err });
		return { error: err };
	}
}

function* watchFetchClouds() {
	yield takeLatest(FETCH_CLOUDS.start, fetchClouds);
}

export default [ watchFetchMasks, watchAddCustomMask, watchDeleteMask, watchFetchClouds ];
