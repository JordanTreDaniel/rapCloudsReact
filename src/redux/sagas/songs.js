import { put, takeEvery, call, select } from 'redux-saga/effects';
import { SEARCH_SONGS, ADD_SONGS, FETCH_SONG_DETAILS, ADD_SONG_DETAILS } from '../actionTypes';
import { getAccessToken } from '../selectors';
import axios from 'axios';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com/';

const apiSearchSongs = async (searchTerm, accessToken) => {
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
	const { searchTerm } = action;
	const accessToken = yield select(getAccessToken);
	const { songs, error } = yield call(apiSearchSongs, searchTerm, accessToken);
	if (error) {
		console.log('Something went wrong', error);
	} else {
		yield put({ type: ADD_SONGS, songs });
	}
}

const apiFetchSongDetails = async (songId, accessToken) => {
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

export function* fetchSongDetails(action) {
	console.log('fetching song details!!', action);
	const { songId } = action;
	const accessToken = yield select(getAccessToken);
	const { song, error } = yield call(apiFetchSongDetails, songId, accessToken);
	if (error) {
		console.log('Something went wrong', error);
	} else {
		yield put({ type: ADD_SONG_DETAILS, song });
	}
}

function* watchSearchSongs(action) {
	yield takeEvery(SEARCH_SONGS, searchSongs);
}

function* watchFetchSongDetails(action) {
	console.log(`watching for ${FETCH_SONG_DETAILS}`);
	yield takeEvery(FETCH_SONG_DETAILS, fetchSongDetails);
}

export default [ watchSearchSongs, watchFetchSongDetails ];
