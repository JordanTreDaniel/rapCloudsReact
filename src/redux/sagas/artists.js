import { put, takeEvery, takeLatest, call, select, cancel, all } from 'redux-saga/effects';
import { FETCH_ARTIST, ADD_SONGS, SIGN_OUT, FETCH_SONG_LYRICS, FETCH_ARTIST_CLOUD } from '../actionTypes';
import { getAccessToken, getArtistFromId } from '../selectors';
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

export function* fetchArtist(action) {
	const { fetchCloudToo = true, artistId } = action;
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
	if (exisitingInStore) {
		//TO-DO: This efficiency check doesn't work around rehydration time
		yield put({ type: FETCH_ARTIST.cancellation });
		yield cancel();
		return;
	}

	const { artist, songs = [], nextPage, error } = yield call(apiFetchArtist, artistId, accessToken);
	if (error) {
		yield put({ type: FETCH_ARTIST.failure, artistId });
	} else {
		artist.nextPage = nextPage;
		if (songs.length) yield put({ type: ADD_SONGS, songs });
		yield put({ type: FETCH_ARTIST.success, artist });

		if (fetchCloudToo) {
			yield put({
				type: FETCH_ARTIST_CLOUD.start,
				songs: songs.map((song) => ({ id: song.id, path: song.path })),
				artistId,
			});
		}
	}
}

export function* genArtistCloud(action) {
	try {
		const { artistId, forceFetch = false, songs } = action;
		const artist = yield select(getArtistFromId, artistId);
		if (artist && artist.encodedCloud && !forceFetch) {
			yield put({ type: FETCH_ARTIST_CLOUD.cancellation });
			yield cancel();
			return;
		}
		const allLyrics = yield all(
			songs.map((song) => {
				const { id: songId, path: songPath } = song;
				return fetchSongLyrics({ type: FETCH_SONG_LYRICS.start, songId, songPath, generateCloud: false });
			}),
		);
		const normalizedLyricsJumble = allLyrics.reduce(
			(acc, songLyrics) => acc + ' ' + normalizeLyrics(songLyrics),
			'',
		);
		const { encodedCloud, error } = yield call(generateCloud, { lyricString: normalizedLyricsJumble });
		if (error) {
			yield put({ type: FETCH_ARTIST_CLOUD.failure });
			console.log('Something went wrong in fetch artist cloud', error);
		} else {
			yield put({ type: FETCH_ARTIST_CLOUD.success, artistId, encodedCloud });
			return encodedCloud;
		}
	} catch (err) {
		yield put({ type: FETCH_ARTIST_CLOUD.failure });
		console.log('Something went wrong in fetch artist cloud', err);
	}
}

function* watchFetchArtist() {
	yield takeEvery(FETCH_ARTIST.start, fetchArtist);
}

function* watchGenArtistCloud() {
	yield takeLatest(FETCH_ARTIST_CLOUD.start, genArtistCloud);
}
export default [ watchFetchArtist, watchGenArtistCloud ];
