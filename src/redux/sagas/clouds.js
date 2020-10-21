import { call, select } from 'redux-saga/effects';
import axios from 'axios';
import { getCloudSettingsForFlight } from '../selectors';
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
