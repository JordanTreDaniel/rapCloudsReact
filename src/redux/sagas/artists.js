import { put, takeEvery, call, select, cancel } from 'redux-saga/effects';
import { FETCH_ARTIST, ADD_SONGS, SIGN_OUT } from '../actionTypes';
import { getAccessToken, getArtistFromId } from '../selectors';
import axios from 'axios';

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
		yield put({ type: FETCH_ARTIST.success, artist });
		yield put({ type: ADD_SONGS, songs });
	}
}

function* watchFetchArtist() {
	yield takeEvery(FETCH_ARTIST.start, fetchArtist);
}

export default [ watchFetchArtist ];
