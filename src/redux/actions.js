import {
	SET_USER,
	ADD_SONGS,
	SEARCH_SONGS,
	FETCH_SONG_DETAILS,
	ADD_SONG_DETAILS,
	SET_SONG_SEARCH_TERM,
	FETCH_ARTIST,
	SIGN_OUT,
	FETCH_ARTIST_CLOUD,
	FETCH_SONG_CLOUD,
	UPDATE_CLOUD_SETTINGS,
} from './actionTypes';

export const setUser = (user = { name: 'Tupac' }) => {
	return { type: SET_USER, user };
};

export const addSongs = (songs = [ { name: 'We finally made it.' } ]) => {
	return { type: ADD_SONGS, songs };
};

export const searchSongs = (searchTerm = null) => {
	return { type: SEARCH_SONGS, searchTerm };
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

export const fetchArtistCloud = () => {
	return { type: FETCH_ARTIST_CLOUD.start, forceFetch: true };
};

export const fetchSongCloud = () => {
	return { type: FETCH_SONG_CLOUD.start, forceFetch: true };
};
export const updateCloudSettings = (key, val) => {
	return { type: UPDATE_CLOUD_SETTINGS, forceFetch: true, key, val };
};
