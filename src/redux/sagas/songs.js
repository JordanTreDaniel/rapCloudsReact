import { put, takeEvery, call, select, cancel } from 'redux-saga/effects';
import {
	SEARCH_SONGS,
	SEARCH_SONGS_FAILURE,
	ADD_SONGS,
	FETCH_SONG_DETAILS,
	ADD_SONG_DETAILS,
	FETCH_SONG_DETAILS_FAILURE,
	SIGN_OUT,
	FETCH_WORD_CLOUD,
	FETCH_WORD_CLOUD_FAILURE,
	FETCH_WORD_CLOUD_SUCCESS
} from '../actionTypes';
import { getAccessToken, getSearchTerm } from '../selectors';
import normalizeLyrics from '../utils/normalizeLyrics';
import axios from 'axios';
import { ImageData } from 'canvas';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiSearchSongs = async (searchTerm, accessToken) => {
	if (!searchTerm || !searchTerm.length || !accessToken) {
		console.error(`Could not search songs without search term & access token`, { searchTerm, accessToken });
		return { error: `Could not search songs without search term & access token` };
	}
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/search`,
		params: {
			q: searchTerm
		},
		headers: {
			Authorization: accessToken
		}
	});
	const { status, statusText, data } = res;
	const { songs } = data;
	if (status === 200) {
		return { songs };
	}

	return { error: { status, statusText } };
};

export function* searchSongs(action) {
	const searchTerm = yield select(getSearchTerm);
	const accessToken = yield select(getAccessToken);
	if (!accessToken || !searchTerm.length) {
		yield put({ type: SEARCH_SONGS_FAILURE });
		if (!accessToken) yield put({ type: SIGN_OUT });
		yield cancel();
	}
	const { songs, error } = yield call(apiSearchSongs, searchTerm, accessToken);
	if (error) {
		console.log('Something went wrong', error);
		yield put({ type: SEARCH_SONGS_FAILURE });
	} else {
		yield put({ type: ADD_SONGS, songs });
	}
}

const apiFetchSongDetails = async (songId, accessToken) => {
	if (!songId || !accessToken) {
		console.error(`Could not fetch song without access token & song id`, { songId, accessToken });
		return { error: `Could not fetch song without access token & song id` };
	}
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/getSongDetails/${songId}`,
		headers: {
			Authorization: accessToken
		}
	});
	const { status, statusText, data } = res;
	const { song } = data;
	if (status === 200) {
		return { song };
	}

	return { error: { status, statusText } };
};

const apiFetchWordCloud = async (lyricString) => {
	// if () {
	// 	console.error(`Could not fetch song without access token & song id`, { songId, accessToken });
	// 	return { error: `Could not fetch song without access token & song id` };
	// }
	// const res = await axios({
	// 	method: 'post',
	// 	url: `https://ukaecdgqm1.execute-api.us-east-1.amazonaws.com/default/generateRapClouds`,
	// 	headers: { accept: 'application/json' },
	// 	body: {
	// 		purpose: 'Hit it from faaar away'
	// 	}
	// });
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
	console.log('original data', data);
	console.log({ status, statusText, data: data.data });
	if (status === 200) {
		return { data: data.data, status, statusText };
	}

	return { error: { status, statusText } };
};

export function* fetchSongDetails(action) {
	const accessToken = yield select(getAccessToken);
	const { songId } = action;
	const { song, error } = yield call(apiFetchSongDetails, songId, accessToken);
	if (error) {
		yield put({ type: FETCH_SONG_DETAILS_FAILURE });
		console.log('Something went wrong', error);
	} else {
		//get lyrics,
		//normalize out bs
		//send lyrics
		let { lyrics } = song;
		lyrics = normalizeLyrics(lyrics);
		const encodedCloud = yield call(fetchWordCloud, { lyricString: lyrics });
		song.encodedCloud = encodedCloud;
		yield put({ type: ADD_SONG_DETAILS, song });
	}
}

export function* fetchWordCloud(action) {
	console.log('FEtch World cloud');
	const { lyricString } = action;
	const { data, error } = yield call(apiFetchWordCloud, lyricString);
	const { encodedCloud } = data;
	if (error) {
		yield put({ type: FETCH_WORD_CLOUD_FAILURE });
		console.log('Something went wrong', error);
	} else {
		console.log('Fetch word cloud!', data);

		yield put({ type: FETCH_WORD_CLOUD_SUCCESS });
		return encodedCloud;
	}
}

function* watchSearchSongs() {
	yield takeEvery(SEARCH_SONGS, searchSongs);
}

function* watchFetchSongDetails() {
	yield takeEvery(FETCH_SONG_DETAILS, fetchSongDetails);
}

function* watchFetchWordCloud() {
	yield takeEvery(FETCH_WORD_CLOUD, fetchWordCloud);
}

export default [ watchSearchSongs, watchFetchSongDetails, watchFetchWordCloud ];
