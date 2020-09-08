const actionNamesForProcess = (baseName) => {
	return {
		failure: `${baseName}_FAILURE`,
		success: `${baseName}_SUCCESS`,
		start: `${baseName}_START`,
		cancellation: `${baseName}_CANCELLATION`
	};
};
export const SET_USER = 'SET_USER';
export const ADD_SONGS = 'ADD_SONGS';
export const SEARCH_SONGS = 'SEARCH_SONGS';
export const SEARCH_SONGS_FAILURE = 'SEARCH_SONGS_FAILURE';
export const FETCH_WORD_CLOUD = 'FETCH_WORD_CLOUD';
export const FETCH_WORD_CLOUD_FAILURE = 'FETCH_WORD_CLOUD_FAILURE';
export const FETCH_WORD_CLOUD_SUCCESS = 'FETCH_WORD_CLOUD_SUCCESS';
export const SET_SONG_SEARCH_TERM = 'SET_SONG_SEARCH_TERM';
export const FETCH_SONG_DETAILS = 'FETCH_SONG_DETAILS';
export const ADD_SONG_DETAILS = 'ADD_SONG_DETAILS';
export const FETCH_SONG_DETAILS_FAILURE = 'FETCH_SONG_DETAILS_FAILURE';
export const CANCEL_SONG_DETAIL_CALL = 'CANCEL_SONG_DETAIL_CALL';
export const SET_HYDRATION_TRUE = 'SET_HYDRATION_TRUE';
export const FETCH_ARTIST = actionNamesForProcess('FETCH_ARTIST');
export const FETCH_SONG_LYRICS = actionNamesForProcess('FETCH_SONG_LYRICS');
export const SIGN_OUT = 'SIGN_OUT';
export const DO_NOTHING = 'DO_NOTHING';
