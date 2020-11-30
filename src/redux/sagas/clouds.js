import { call, select, takeLatest, put, takeEvery, cancel } from 'redux-saga/effects';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { getCloudSettingsForFlight, getUserMongoId, getCloudFromId } from '../selectors';
import { FETCH_MASKS, ADD_CUSTOM_MASK, DELETE_MASK, FETCH_CLOUDS, DELETE_CLOUD } from '../actionTypes';
import { listRapClouds } from '../../graphql/queries';
import { createRapCloud, deleteRapCloud } from '../../graphql/mutations';
import { API, graphqlOperation, Auth, Storage } from 'aws-amplify';
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

const apiDeleteCloud = async (cloud) => {
	try {
		const { id: cloudId, filePath, level = 'public' } = cloud;
		const s3Res = await Storage.remove(filePath, { level }); //TO-DO: Implement levels on clouds
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

const apiSaveCloud = async (cloud) => {
	try {
		const cloudData = await API.graphql(graphqlOperation(createRapCloud, { input: cloud }));
		return cloudData.data.createRapCloud;
	} catch (err) {
		console.error("Couldn't save the cloud", { cloud, err });
	}
};

const s3SaveCloud = async (encodedCloud) => {
	try {
		const blob = await fetch(`data:image/png;base64, ${encodedCloud}`).then((res) => res.blob());
		const { key } = await Storage.put(`${uuid()}.png`, blob, {
			contentType: 'image/png',
			level: 'public', //TO-DO: Get private/protected levels to work.
			// ...the fact that it doesn't work with those levels is likely bc of this:
			// https://github.com/JordanTreDaniel/rapCloudsReact/pull/17/commits/cdf81390aba5e9e566de70692177979709f43f97
		});
		const viewingUrl = await Storage.get(key);
		return { key, viewingUrl };
	} catch (error) {
		console.error("Couldn't save the cloud to S3", { error });
		return { error };
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
		if (error) {
			console.log('Something went wrong in generateCloud', error);
			return { error };
		} else {
			const { encodedCloud } = data;
			const { key, viewingUrl } = yield call(s3SaveCloud, encodedCloud);
			cloud = { ...cloud, filePath: key, viewingUrl };
			cloud = yield call(apiSaveCloud, cloud);
			return { finishedCloud: cloud };
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

function* watchDeleteCloud() {
	yield takeEvery(DELETE_CLOUD.start, deleteCloud);
}

export default [ watchFetchMasks, watchAddCustomMask, watchDeleteMask, watchFetchClouds, watchDeleteCloud ];
