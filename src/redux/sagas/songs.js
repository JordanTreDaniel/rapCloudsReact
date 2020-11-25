import { put, takeEvery, call, select, cancel, delay, takeLatest } from 'redux-saga/effects';
import {
	SEARCH_SONGS,
	ADD_SONGS,
	FETCH_SONG_DETAILS,
	FETCH_SONG_LYRICS,
	SIGN_OUT,
	FETCH_SONG_CLOUD,
} from '../actionTypes';
import { generateCloud } from './clouds';
import { getAccessToken, getSearchTerm, getSongFromId } from '../selectors';
import normalizeLyrics from '../utils/normalizeLyrics';
import axios from 'axios';

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
			q: searchTerm,
		},
		headers: {
			Authorization: accessToken,
		},
	});
	const { status, statusText, data } = res;
	const { songs } = data;
	if (status === 200) {
		return { songs };
	}

	return { error: { status, statusText } };
};

export function* searchSongs(action) {
	const searchTerm = action.searchTerm ? action.searchTerm : yield select(getSearchTerm);
	const accessToken = yield select(getAccessToken);
	if (!accessToken || !searchTerm.length) {
		yield put({ type: SEARCH_SONGS.cancellation });
		if (!accessToken) yield put({ type: SIGN_OUT });
		yield cancel();
	}
	const { songs, error } = yield call(apiSearchSongs, searchTerm, accessToken);
	if (error) {
		console.log('Something went wrong', error);
		yield put({ type: SEARCH_SONGS.failure });
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
			Authorization: accessToken,
		},
	});
	const { status, statusText, data } = res;
	const { song } = data;
	if (status === 200) {
		return { song };
	}

	return { error: { status, statusText } };
};

const apiFetchSongLyrics = async (songPath, songId) => {
	if (!songPath || !songId) {
		console.error(`Could not fetch song lyrics without song path/song id.`, { songPath, songId });
		return { error: `Could not fetch song lyrics without song path/song id.` };
	}
	const res = await axios({
		method: 'post',
		url: `${REACT_APP_SERVER_ROOT}/getSongLyrics`,
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			songPath,
			songId,
		},
	});
	const { status, statusText, data } = res;
	const { lyrics } = data;
	if (status === 200) {
		return { lyrics };
	}

	return { error: { status, statusText } };
};

export function* fetchSongDetails(action) {
	const accessToken = yield select(getAccessToken);
	const { songId, fetchLyrics = true, generateCloud = true } = action;
	const existingSong = yield select(getSongFromId, songId);
	if (existingSong && existingSong.normalizedLyrics && existingSong.encodedCloud) {
		yield put({ type: FETCH_SONG_DETAILS.cancellation });
		yield cancel();
	}
	const { song, error } = yield call(apiFetchSongDetails, songId, accessToken);
	if (error) {
		yield put({ type: FETCH_SONG_DETAILS.failure });
		console.error('Something went wrong', error);
	} else {
		const { path: songPath } = song;
		yield put({ type: FETCH_SONG_DETAILS.success, song });
		if (fetchLyrics) {
			yield delay(500);
			yield put({ type: FETCH_SONG_LYRICS.start, songId, songPath, generateCloud });
		}
	}
}

export function* fetchSongLyrics(action) {
	const { songPath, songId, generateCloud = true, forceFetch = false } = action;
	const song = yield select(getSongFromId, songId);
	let lyrics = song.lyrics;
	try {
		if (song.lyrics && !forceFetch) {
			yield put({ type: FETCH_SONG_LYRICS.cancellation });
			return song.lyrics;
		}
		const { lyrics: newLyrics, error } = yield call(apiFetchSongLyrics, songPath, songId);
		lyrics = newLyrics;
		if (error) {
			yield put({ type: FETCH_SONG_LYRICS.failure, songId, songPath });
			console.error('Something went wrong', error);
		} else {
			yield put({ type: FETCH_SONG_LYRICS.success, songId, lyrics });
			return lyrics;
		}
	} catch (err) {
		console.log('Something went wrong in fetchSongLyrics', err);
	} finally {
		if (generateCloud) {
			const normalizedLyrics = normalizeLyrics(lyrics);
			yield put({ type: FETCH_SONG_CLOUD.start, lyricString: normalizedLyrics, songId });
		}
	}
}

export function* genSongCloud(action) {
	try {
		const { lyricString, songId, forceFetch = false } = action;
		const song = yield select(getSongFromId, songId);
		if (song.encodedCloud && !forceFetch) {
			yield put({ type: FETCH_SONG_CLOUD.cancellation });
			yield cancel();
			return;
		}
		const { encodedCloud, error } = yield call(generateCloud, { lyricString });
		if (error) {
			yield put({ type: FETCH_SONG_CLOUD.failure });
			console.log('Something went wrong in fetch song cloud', error);
		} else {
			yield put({ type: FETCH_SONG_CLOUD.success, songId, encodedCloud });
			return encodedCloud;
		}
	} catch (err) {
		yield put({ type: FETCH_SONG_CLOUD.failure });
		console.log('Something went wrong in fetch song cloud', err);
	}
}

function* watchSearchSongs() {
	yield takeLatest(SEARCH_SONGS.start, searchSongs);
}

function* watchFetchSongDetails() {
	yield takeEvery(FETCH_SONG_DETAILS.start, fetchSongDetails);
}

function* watchGenSongCloud() {
	yield takeLatest(FETCH_SONG_CLOUD.start, genSongCloud);
}

function* watchFetchSongLyrics() {
	yield takeEvery(FETCH_SONG_LYRICS.start, fetchSongLyrics);
}

export default [ watchSearchSongs, watchFetchSongDetails, watchGenSongCloud, watchFetchSongLyrics ];
