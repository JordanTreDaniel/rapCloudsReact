import { SET_USER, SET_SONGS, SEARCH_SONGS, FETCH_SONG_DETAILS } from './actionTypes';

export const setUser = (user = { name: 'Tupac' }) => {
	return { type: SET_USER, user };
};

export const setSongs = (songs = [ { name: 'We finally made it.' } ]) => {
	return { type: SET_SONGS, songs };
};

export const searchSongs = (searchTerm = 'wonder') => {
	return { type: SEARCH_SONGS, searchTerm };
};

export const fetchSongDetails = (songId) => {
	return { type: FETCH_SONG_DETAILS, songId };
};
