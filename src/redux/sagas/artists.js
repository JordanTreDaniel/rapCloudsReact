import { put, takeEvery, call, select, cancel } from 'redux-saga/effects';
import { FETCH_ARTIST, ADD_SONGS } from '../actionTypes';
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
	const { artistId } = action;
	const exisitingInStore = yield select(getArtistFromId, artistId);
	if (exisitingInStore) {
		yield put({ type: FETCH_ARTIST.cancellation });
		yield cancel();
		return;
	}
	const accessToken = yield select(getAccessToken);

	if (!accessToken || !artistId) {
		console.error(`Could not fetch artist without access token & artist id`, { artistId, accessToken });
		//TO-DO: If there is no accessToken, log the user out.
		yield cancel();
	}
	const { artist, error } = yield call(apiFetchArtist, artistId, accessToken);
	if (error) {
		yield put(FETCH_ARTIST.failure);
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
