import { put, takeEvery, takeLatest, call, select, cancel, all } from 'redux-saga/effects';
import {
	FETCH_ARTIST,
	ADD_SONGS,
	SIGN_OUT,
	FETCH_SONG_LYRICS,
	GEN_ARTIST_CLOUD,
	FETCH_ARTIST_SONGS,
	FETCH_ARTIST_GAME,
} from '../actionTypes';
import { getAccessToken, getArtistFromId, getCloudsForArtist, getArtistsSongs } from '../selectors';
import { fetchSongLyrics } from './songs';
import { generateCloud } from './clouds';
import axios from 'axios';
import normalizeLyrics from '../utils/normalizeLyrics';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiFetchArtist = async (artistId, accessToken) => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/getArtistDetails/${artistId}`,
		headers: {
			Authorization: accessToken,
		},
	});
	const { status, statusText, data } = res;
	const { artist, songs, nextPage } = data;
	if (status === 200) {
		return { artist, songs, nextPage };
	}

	return { error: { status, statusText } };
};

const apiFetchArtistSongs = async (artistId, page, accessToken) => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/getArtistSongs/${artistId}/${page}`,
		headers: {
			Authorization: accessToken,
		},
	});
	const { status, statusText, data } = res;
	const { songs, nextPage } = data;
	if (status === 200) {
		return { songs, nextPage };
	}

	return { error: { status, statusText } };
};

export function* fetchArtist(action) {
	const { fetchCloudToo = true, artistId, forceFetch = false } = action;
	const accessToken = yield select(getAccessToken);
	if (!accessToken) {
		console.error(`Could not fetch artist without access token `, { accessToken });
		yield put({ type: SIGN_OUT });
		yield cancel();
	}
	if (!artistId) {
		console.error(`Could not fetch artist without artist id`, { artistId });
		yield put({ type: FETCH_ARTIST.failure, artistId });
		yield cancel();
	}
	const exisitingInStore = yield select(getArtistFromId, artistId);
	if (exisitingInStore && !forceFetch) {
		//TO-DO: This efficiency check doesn't work around rehydration time
		yield put({ type: FETCH_ARTIST.cancellation });
		yield cancel();
		return;
	}

	const { artist, songs = [], nextPage, error } = yield call(apiFetchArtist, artistId, accessToken);
	if (error) {
		yield put({ type: FETCH_ARTIST.failure, artistId, error });
		return error;
	} else {
		artist.nextPage = nextPage;
		if (songs.length) yield put({ type: ADD_SONGS, songs });
		yield put({ type: FETCH_ARTIST.success, artist });

		if (fetchCloudToo) {
			yield put({
				type: GEN_ARTIST_CLOUD.start,
				songs: songs.map((song) => ({ id: song.id, path: song.path })),
				artistId,
			});
		}
		return { artist, songs };
	}
}

export function* fetchArtistSongs(action) {
	const { artistId } = action;
	const accessToken = yield select(getAccessToken);
	if (!accessToken) {
		console.error(`Could not fetch artist without access token `, { accessToken });
		yield put({ type: SIGN_OUT });
		yield cancel();
	}
	if (!artistId) {
		console.error(`Could not fetch artist without artist id`, { artistId });
		yield put({ type: FETCH_ARTIST_SONGS.failure, artistId });
		yield cancel();
	}
	const artist = yield select(getArtistFromId, artistId);
	const { nextPage } = artist;
	if (!nextPage) {
		yield put({ type: FETCH_ARTIST_SONGS.cancellation, artistId, reason: "Next page doesn't exist." });
	}
	const { songs = [], nextPage: newNextPage, error } = yield call(
		apiFetchArtistSongs,
		artistId,
		nextPage,
		accessToken,
	);
	if (error) {
		yield put({ type: FETCH_ARTIST_SONGS.failure, artistId });
	} else {
		artist.nextPage = newNextPage;
		if (songs.length) yield put({ type: ADD_SONGS, songs });
		yield put({ type: FETCH_ARTIST_SONGS.success, artist });
	}
}

export function* genArtistCloud(action) {
	try {
		const { artistId, forceFetch = false } = action;
		let { cloud = {} } = action;
		const artist = yield select(getArtistFromId, artistId);
		const cloudsForArtist = yield select(getCloudsForArtist, artistId);
		const songs = yield select(getArtistsSongs, artistId);
		if (artist && cloudsForArtist.length && !forceFetch) {
			yield put({ type: GEN_ARTIST_CLOUD.cancellation });
			yield cancel();
			return;
		}
		const songIds = [],
			artistIds = [ artistId ];
		const allLyrics = yield all(
			songs.map((song) => {
				const { id: songId, path: songPath } = song;
				songIds.push(songId);
				//TO-DO: Add artistIds from each artist of the song.artists
				// artistIds.push(artistId);
				return fetchSongLyrics({ type: FETCH_SONG_LYRICS.start, songId, songPath, generateCloud: false });
			}),
		);
		const normalizedLyricsJumble = allLyrics.reduce(
			(acc, songLyrics) => acc + ' ' + normalizeLyrics(songLyrics),
			'',
		);
		cloud = {
			...cloud,
			artistIds,
			songIds,
			lyricString: normalizedLyricsJumble,
			inspirationType: 'artist',
		};
		const { finishedCloud, error } = yield call(generateCloud, {
			lyricString: normalizedLyricsJumble,
			cloud,
		});
		if (error) {
			yield put({ type: GEN_ARTIST_CLOUD.failure });
			console.log('Something went wrong in fetch artist cloud', error);
		} else {
			yield put({ type: GEN_ARTIST_CLOUD.success, finishedCloud });
			return finishedCloud;
		}
	} catch (err) {
		yield put({ type: GEN_ARTIST_CLOUD.failure });
		console.log('Something went wrong in fetch artist cloud', err);
	}
}

//TO-DO: Move this to games sagas when created.
export function* fetchArtistGame(action) {
	try {
		const { artistId } = action;
		const { _, songs, error } = yield call(fetchArtist, { artistId, fetchCloudToo: false, forceFetch: true });
		const game = { artistId, songIds: songs.map((song) => song.id) };
		if (error) {
			yield put({ type: FETCH_ARTIST_GAME.failure });
			console.log('Something went wrong in fetch artist cloud', error);
		} else {
			yield put({ type: FETCH_ARTIST_GAME.success, game });
			return game;
		}
	} catch (err) {
		yield put({ type: FETCH_ARTIST_GAME.failure });
		console.log('Something went wrong in fetch artist cloud', err);
	}
}

function* watchFetchArtist() {
	yield takeEvery(FETCH_ARTIST.start, fetchArtist);
}

function* watchFetchArtistSongs() {
	yield takeEvery(FETCH_ARTIST_SONGS.start, fetchArtistSongs);
}

function* watchGenArtistCloud() {
	yield takeEvery(GEN_ARTIST_CLOUD.start, genArtistCloud);
}

function* watchGenArtistGame() {
	yield takeEvery(FETCH_ARTIST_GAME.start, fetchArtistGame);
}

export default [ watchFetchArtist, watchGenArtistCloud, watchFetchArtistSongs, watchGenArtistGame ];
