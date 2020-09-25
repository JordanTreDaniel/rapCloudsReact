import watchingSongSagas from './songs';
import watchingUserSagas from './user';
import watchingArtistSagas from './artists';
import { call } from 'redux-saga/effects';
import axios from 'axios';

const apiFetchWordCloud = async (lyricString) => {
	const res = await axios({
		method: 'post',
		url: `http://localhost:3333/makeWordCloud`,
		headers: {
			'Content-Type': 'application/json'
			// 'Accept-Encoding': 'gzip',
			// 'Access-Control-Allow-Origin': '*'
			// 'Access-Control-Allow-Headers': 'Content-Type',
			// Accept: 'application/json'
		},
		data: {
			lyricJSON: {
				lyricString
			}
		}
	});

	const { status, statusText, data } = res;

	if (status === 200) {
		return { data: data.data, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* fetchWordCloud(action) {
	try {
		const { lyricString } = action;
		if (!lyricString || !lyricString.length) return { error: { message: 'Must include lyrics to get a cloud' } };
		const { data, error } = yield call(apiFetchWordCloud, lyricString);
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

export default [ ...watchingSongSagas, ...watchingUserSagas, ...watchingArtistSagas ];
