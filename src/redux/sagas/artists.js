import { put, takeEvery, call, select, cancel, all } from 'redux-saga/effects';
import { FETCH_ARTIST, ADD_SONGS, SIGN_OUT, FETCH_SONG_LYRICS } from '../actionTypes';
import { getAccessToken, getArtistFromId } from '../selectors';
import { fetchSongLyrics, fetchWordCloud } from './songs';
import axios from 'axios';
import normalizeLyrics from '../utils/normalizeLyrics';

const REACT_APP_SERVER_ROOT =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';

const apiFetchArtist = async (artistId, accessToken) => {
	const res = await axios({
		method: 'get',
		url: `${REACT_APP_SERVER_ROOT}/getArtistDetails/${artistId}`,
		headers: {
			Authorization: accessToken
		}
	});
	const { status, statusText, data } = res;
	const { artist } = data;
	if (status === 200) {
		return { artist };
	}

	return { error: { status, statusText } };
};

export function* fetchArtist(action) {
	const { fetchArtistCloud = true } = action;
	const accessToken = yield select(getAccessToken);
	if (!accessToken) {
		console.error(`Could not fetch artist without access token `, { accessToken });
		yield put({ type: SIGN_OUT });
		yield cancel();
	}
	const { artistId } = action;
	if (!artistId) {
		console.error(`Could not fetch artist without artist id`, { artistId });
		yield put({ type: FETCH_ARTIST.failure, artistId });
		yield cancel();
	}
	const exisitingInStore = yield select(getArtistFromId, artistId);
	if (exisitingInStore) {
		yield put({ type: FETCH_ARTIST.cancellation });
		yield cancel();
		return;
	}

	const { artist, error } = yield call(apiFetchArtist, artistId, accessToken);
	if (error) {
		yield put({ type: FETCH_ARTIST.failure, artistId });
	} else {
		const { songs = [] } = artist;
		delete artist.songs;
		yield put({ type: ADD_SONGS, songs });
		if (fetchArtistCloud) {
			const allLyrics = yield all(
				songs.map((song) => {
					const { id: songId, path: songPath } = song;
					return fetchSongLyrics({ type: FETCH_SONG_LYRICS.start, songId, songPath, fetchWordCloud: false });
				})
			);
			const normalizedLyricsJumble = allLyrics.reduce(
				(acc, songLyrics) => acc + ' ' + normalizeLyrics(songLyrics),
				''
			);

			const encodedCloud = yield call(fetchWordCloud, { lyricString: normalizedLyricsJumble });
			artist.encodedCloud = encodedCloud;
		}
		yield put({ type: FETCH_ARTIST.success, artist });
	}
}

function* watchFetchArtist() {
	yield takeEvery(FETCH_ARTIST.start, fetchArtist);
}

export default [ watchFetchArtist ];
