import { call, select, takeLatest, put, takeEvery, cancel } from 'redux-saga/effects';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { getCloudSettingsForFlight, getUserMongoId, getCloudFromId, getMaskFromId } from '../selectors';
import { FETCH_MASKS, ADD_CUSTOM_MASK, DELETE_MASK, FETCH_CLOUDS, DELETE_CLOUD } from '../actionTypes';
import { listRapClouds } from '../../graphql/queries';
import { createRapCloud, deleteRapCloud } from '../../graphql/mutations';
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify';
import { getAwsUserEmail } from '../../utils';
const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiGenerateCloud = async (cloud) => {
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/generateCloud`,
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
		data: cloud,
	});

	const { status, statusText, data } = res;

	if (status === 200) {
		return { data: data.data, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* generateCloud(action) {
	try {
		let { lyricString, cloud } = action;
		if (!lyricString || !lyricString.length) return { error: { message: 'Must include lyrics to get a cloud' } };
		const cloudSettingsForFlight = yield select(getCloudSettingsForFlight);
		const userId = yield select(getUserMongoId);
		cloud = {
			...cloud,
			settings: cloudSettingsForFlight,
			lyricString,
			userId,
		};
		const { data, error } = yield call(apiGenerateCloud, cloud);
		if (error) {
			console.error('Something went wrong in generateCloud', error);
			return { error };
		} else {
			const { rapCloud } = data;
			return { finishedCloud: rapCloud };
		}
	} catch (err) {
		console.error('Something went wrong', err);
		return { error: err };
	}
}

const apiDeleteCloud = async (cloud) => {
	try {
		const { id: cloudId, filePath, level = 'public' } = cloud;
		await Storage.remove(filePath, { level }); //TO-DO: Implement levels on clouds
		const cloudData = await API.graphql(graphqlOperation(deleteRapCloud, { input: { id: cloudId } }));
		return { data: cloudData.data.deleteRapCloud };
	} catch (error) {
		console.error("Couldn't delete the cloud", { cloud, error });
		return { error };
	}
};

export function* deleteCloud(action) {
	try {
		const { cloudId } = action;
		if (!cloudId) {
			yield put({ type: DELETE_CLOUD.cancellation });
			yield cancel();
		}
		const cloud = yield select(getCloudFromId, cloudId);
		const { error } = yield call(apiDeleteCloud, cloud);
		if (error) {
			console.log('Something went wrong in deleteCloud', error);
			return { error };
		} else {
			yield put({ type: DELETE_CLOUD.success, cloudId });
			return cloudId;
		}
	} catch (err) {
		console.log('Something went wrong', err);
		yield put({ type: DELETE_CLOUD.failure, err });
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

const apiDeleteMask = async ({ maskId, public_id }) => {
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
			public_id,
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
	const mask = yield select(getMaskFromId, maskId);
	const { public_id } = mask.info;
	if (!maskId || !userId) {
		yield put({ type: DELETE_MASK.cancellation });
	}
	try {
		const { error } = yield call(apiDeleteMask, { maskId, public_id });
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

const apiFetchClouds = async (userId) => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/getClouds/${userId}`,
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const { status, statusText, data } = res;
	const { clouds } = data;
	if (status === 200) {
		return { clouds, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* fetchClouds(action) {
	try {
		const userId = yield select(getUserMongoId);
		const { clouds, error } = yield call(apiFetchClouds, userId);
		if (error) {
			console.log('Something went wrong in fetchClouds', error);
			return { error };
		} else {
			yield put({ type: FETCH_CLOUDS.success, clouds });
			return { clouds };
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

function* watchDeleteCloud() {
	yield takeEvery(DELETE_CLOUD.start, deleteCloud);
}

export default [ watchFetchMasks, watchAddCustomMask, watchDeleteMask, watchFetchClouds, watchDeleteCloud ];
