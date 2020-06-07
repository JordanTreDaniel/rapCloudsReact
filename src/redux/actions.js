import {
	SET_USER,
	ADD_SONGS,
	SEARCH_SONGS,
	FETCH_SONG_DETAILS,
	SET_CURRENT_SONG_ID,
	ADD_SONG_DETAILS,
	SET_SONG_SEARCH_TERM,
	FETCH_ARTIST
} from './actionTypes';

export const setUser = (user = { name: 'Tupac' }) => {
	return { type: SET_USER, user };
};

export const addSongs = (songs = [ { name: 'We finally made it.' } ]) => {
	return { type: ADD_SONGS, songs };
};

export const searchSongs = () => {
	console.log("action triggered");
	return { type: SEARCH_SONGS };
};

export const setSongSearchTerm = (searchTerm = '') => {
	return { type: SET_SONG_SEARCH_TERM, searchTerm };
};

export const fetchSongDetails = () => {
	return { type: FETCH_SONG_DETAILS };
};

export const setCurrentSongId = (songId = null) => {
	return { type: SET_CURRENT_SONG_ID, songId };
};

export const fetchArtist = (artistId) => {
	console.log('from actions', artistId);
	return { type: FETCH_ARTIST, artistId };
};

export const addSongDetails = (song) => {
	return { type: ADD_SONG_DETAILS, song };
};
