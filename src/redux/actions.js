import {
	SET_USER,
	ADD_SONGS,
	SEARCH_SONGS,
	FETCH_SONG_DETAILS,
	SET_SONG_SEARCH_TERM,
	FETCH_ARTIST,
	SIGN_OUT,
	FETCH_ARTIST_CLOUD,
	FETCH_SONG_CLOUD,
	UPDATE_CLOUD_SETTINGS,
	FETCH_MASKS,
	ADD_CUSTOM_MASK,
	RESET_CLOUD_DEFAULTS,
	DELETE_MASK,
	FETCH_SONG_LYRICS,
	UPDATE_USER,
	FETCH_CLOUDS,
} from './actionTypes';
import normalizeLyrics from './utils/normalizeLyrics';

export const setUser = (user = { name: 'Tupac' }) => {
	return { type: SET_USER, user };
};

export const updateUser = (userUpdates) => {
	return { type: UPDATE_USER.start, userUpdates };
};

export const addSongs = (songs = [ { name: 'We finally made it.' } ]) => {
	return { type: ADD_SONGS, songs };
};

export const searchSongs = (searchTerm = null) => {
	return { type: SEARCH_SONGS.start, searchTerm };
};

export const fetchSongLyrics = (songId, songPath) => {
	return { type: FETCH_SONG_LYRICS.start, songId, songPath, forceFetch: true };
};

export const setSongSearchTerm = (searchTerm = '') => {
	return { type: SET_SONG_SEARCH_TERM, searchTerm };
};

export const fetchSongDetails = (songId) => {
	return { type: FETCH_SONG_DETAILS.start, songId };
};

export const fetchArtist = (artistId) => {
	return { type: FETCH_ARTIST.start, artistId };
};

export const signOut = () => {
	return { type: SIGN_OUT };
};

export const fetchArtistCloud = () => {
	return { type: FETCH_ARTIST_CLOUD.start, forceFetch: true };
};

export const fetchSongCloud = (songId, songLyrics) => {
	const normalizedLyrics = normalizeLyrics(songLyrics);
	return { type: FETCH_SONG_CLOUD.start, lyricString: normalizedLyrics, songId, forceFetch: true };
};
export const updateCloudSettings = (key, val) => {
	return { type: UPDATE_CLOUD_SETTINGS, forceFetch: true, key, val };
};

export const fetchClouds = () => {
	return { type: FETCH_CLOUDS.start };
};

export const fetchMasks = () => {
	return { type: FETCH_MASKS.start };
};

export const addCustomMask = (newMask) => {
	return { type: ADD_CUSTOM_MASK.start, newMask };
};

export const deleteMask = (maskId) => {
	return { type: DELETE_MASK.start, maskId };
};

export const resetCloudDefaults = () => {
	return { type: RESET_CLOUD_DEFAULTS };
};
