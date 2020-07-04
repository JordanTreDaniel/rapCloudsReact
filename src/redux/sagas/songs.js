import { put, takeEvery, call, select, cancel } from 'redux-saga/effects';
import { SEARCH_SONGS, ADD_SONGS, FETCH_SONG_DETAILS, ADD_SONG_DETAILS, SET_CURRENT_SONG_ID } from '../actionTypes';
import { getAccessToken, getSearchTerm } from '../selectors';
import axios from 'axios';
import { history } from '../store';
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
		//TO-DO: If there is no accessToken, log the user out.
		yield cancel();
	}
	const { songs, error } = yield call(apiSearchSongs, searchTerm, accessToken);
	if (error) {
		console.log('Something went wrong', error);
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

export function* fetchSongDetails(action) {
	const accessToken = yield select(getAccessToken);
	const { songId } = action;
	const { song, error } = yield call(apiFetchSongDetails, songId, accessToken);
	if (error) {
		console.log('Something went wrong', error);
	} else {
		yield put({ type: ADD_SONG_DETAILS, song });
	}
}

function* watchSearchSongs() {
	yield takeEvery(SEARCH_SONGS, searchSongs);
}

function* watchFetchSongDetails() {
	yield takeEvery(FETCH_SONG_DETAILS, fetchSongDetails);
}

export default [ watchSearchSongs, watchFetchSongDetails ];
