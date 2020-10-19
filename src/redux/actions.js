import {
	SET_USER,
	ADD_SONGS,
	SEARCH_SONGS,
	FETCH_SONG_DETAILS,
	ADD_SONG_DETAILS,
	SET_SONG_SEARCH_TERM,
	FETCH_ARTIST,
	SIGN_OUT,
} from './actionTypes';

export const setUser = (user = { name: 'Tupac' }) => {
	return { type: SET_USER, user };
};

export const addSongs = (songs = [ { name: 'We finally made it.' } ]) => {
	return { type: ADD_SONGS, songs };
};

export const searchSongs = () => {
	return { type: SEARCH_SONGS };
};

export const setSongSearchTerm = (searchTerm = '') => {
	return { type: SET_SONG_SEARCH_TERM, searchTerm };
};

export const fetchSongDetails = (songId) => {
	return { type: FETCH_SONG_DETAILS, songId };
};

export const fetchArtist = (artistId) => {
	return { type: FETCH_ARTIST.start, artistId };
};

export const addSongDetails = (song) => {
	return { type: ADD_SONG_DETAILS, song };
};

export const signOut = () => {
	return { type: SIGN_OUT };
};
