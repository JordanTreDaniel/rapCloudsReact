import { put, takeEvery, call, select, cancel, delay, takeLatest } from 'redux-saga/effects';
import {
	SEARCH_SONGS,
	ADD_SONGS,
	FETCH_SONG_DETAILS,
	FETCH_SONG_LYRICS,
	SIGN_OUT,
	GEN_SONG_CLOUD,
	ADD_ARTISTS,
	ADD_CLOUD,
} from '../actionTypes';
import { generateCloud } from './clouds';
import { getAccessToken, getSearchTerm, getSongFromId, getCloudsForSong, getOfficalCloudForSong } from '../selectors';
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
	const { songs, artists } = data;
	if (status === 200) {
		return { songs, artists };
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
	const { songs, artists, error } = yield call(apiSearchSongs, searchTerm, accessToken);
	if (error) {
		console.log('Something went wrong', error);
		yield put({ type: SEARCH_SONGS.failure });
	} else {
		yield put({ type: ADD_SONGS, songs });
		yield put({ type: ADD_ARTISTS, artists });
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
	const { song, cloud } = data;
	if (status === 200) {
		return { song, cloud };
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
	const officialCloudForSong = yield select(getOfficalCloudForSong, songId);
	if (existingSong && existingSong.normalizedLyrics && officialCloudForSong && officialCloudForSong.info) {
		//TO-DO: Check for existing clouds with no info and delete?
		yield put({ type: FETCH_SONG_DETAILS.cancellation });
		yield cancel();
	}
	const { song, cloud: officialCloud, error } = yield call(apiFetchSongDetails, songId, accessToken);
	if (error) {
		yield put({ type: FETCH_SONG_DETAILS.failure });
		console.error('Something went wrong', error);
	} else {
		const { path: songPath } = song;
		yield put({ type: FETCH_SONG_DETAILS.success, song });
		if (officialCloud) {
			yield put({ type: ADD_CLOUD, finishedCloud: officialCloud });
		}
		if (fetchLyrics) {
			yield delay(500);
			yield put({
				type: FETCH_SONG_LYRICS.start,
				songId,
				songPath,
				generateCloud: generateCloud && !officialCloud,
			});
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
			if (generateCloud) {
				const normalizedLyrics = normalizeLyrics(song.lyrics);
				yield put({ type: GEN_SONG_CLOUD.start, lyricString: normalizedLyrics, songId, officialCloud: true });
			}
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
	}
}

export function* genSongCloud(action) {
	try {
		let { cloud = {} } = action;
		const { lyricString, songId, forceFetch = false, officialCloud = false } = action;
		const song = yield select(getSongFromId, songId);
		const officialCloudForSong = yield select(getOfficalCloudForSong, songId);
		if (officialCloudForSong && !forceFetch) {
			yield put({ type: GEN_SONG_CLOUD.cancellation });
			yield cancel();
			return;
		}

		const songIds = [ songId ],
			artistIds = song.writer_artists && song.writer_artists.map((artist) => artist.id);
		artistIds.push(song.primary_artist.id);
		cloud = {
			...cloud,
			artistIds,
			songIds,
			lyricString,
			inspirationType: 'song',
			officialCloud,
		};
		if (officialCloud && cloud.userId) {
			delete cloud.userId;
		}
		const { finishedCloud, error } = yield call(generateCloud, { lyricString, cloud });
		if (error) {
			yield put({ type: GEN_SONG_CLOUD.failure });
			console.log('Something went wrong in fetch song cloud', error);
		} else {
			yield put({ type: GEN_SONG_CLOUD.success, finishedCloud });
			return finishedCloud;
		}
	} catch (err) {
		yield put({ type: GEN_SONG_CLOUD.failure, err });
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
	yield takeEvery(GEN_SONG_CLOUD.start, genSongCloud);
}

function* watchFetchSongLyrics() {
	yield takeEvery(FETCH_SONG_LYRICS.start, fetchSongLyrics);
}

export default [ watchSearchSongs, watchFetchSongDetails, watchGenSongCloud, watchFetchSongLyrics ];
