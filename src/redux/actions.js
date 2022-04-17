import {
	ADD_CUSTOM_MASK,
	ADD_SONGS,
	ANSWER_QUESTION,
	COPY_CLOUD_SETTINGS,
	DELETE_CLOUDS,
	DELETE_MASK,
	FETCH_ARTIST_GAME,
	FETCH_ARTIST_SONGS,
	FETCH_ARTIST,
	FETCH_CLOUDS,
	FETCH_GOOGLE_FONTS,
	FETCH_MASKS,
	FETCH_SONG_DETAILS,
	FETCH_SONG_LYRICS,
	GEN_ARTIST_CLOUD,
	GEN_SONG_CLOUD,
	RESET_CLOUD_DEFAULTS,
	SEARCH_SONGS,
	SET_CURRENT_FONT_NAME,
	SET_FONT_SEARCH_TERM,
	SET_SONG_LYRICS,
	SET_SONG_SEARCH_TERM,
	SET_USER,
	SIGN_OUT,
	UPDATE_CLOUD_SETTINGS,
	UPDATE_USER,
} from "./actionTypes";
import normalizeLyrics from "./utils/normalizeLyrics";

export const setUser = (user = { name: "Tupac" }) => {
	return { type: SET_USER, user };
};

export const updateUser = (userUpdates) => {
	return { type: UPDATE_USER.start, userUpdates };
};

export const addSongs = (songs = [{ name: "We finally made it." }]) => {
	return { type: ADD_SONGS, songs };
};

export const searchSongs = (searchTerm = null) => {
	return { type: SEARCH_SONGS.start, searchTerm };
};

export const fetchSongLyrics = (songId) => {
	return { type: FETCH_SONG_LYRICS.start, songId, forceFetch: true };
};

export const setSongSearchTerm = (searchTerm = "") => {
	return { type: SET_SONG_SEARCH_TERM, searchTerm };
};

export const setFontSearchTerm = (searchTerm = "") => {
	return { type: SET_FONT_SEARCH_TERM, searchTerm };
};

export const setCurrentFontName = (fontName) => {
	return { type: SET_CURRENT_FONT_NAME, fontName };
};

export const fetchSongDetails = (songId) => {
	return { type: FETCH_SONG_DETAILS.start, songId };
};

export const fetchArtist = (artistId) => {
	return { type: FETCH_ARTIST.start, artistId };
};

export const fetchArtistSongs = (artistId) => {
	return { type: FETCH_ARTIST_SONGS.start, artistId };
};

export const signOut = () => {
	return { type: SIGN_OUT };
};

export const genArtistCloud = (artistId) => {
	return { type: GEN_ARTIST_CLOUD.start, forceFetch: true, artistId };
};

export const genSongCloud = (songId, songLyrics) => {
	const normalizedLyrics = normalizeLyrics(songLyrics); //TO-DO: Move this to another place
	return {
		type: GEN_SONG_CLOUD.start,
		lyricString: normalizedLyrics,
		songId,
		forceFetch: true,
	};
};

export const deleteClouds = (cloudIds) => {
	return { type: DELETE_CLOUDS.start, cloudIds };
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

export const fetchGoogleFonts = () => {
	return { type: FETCH_GOOGLE_FONTS.start };
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

export const fetchArtistGame = (artistId, level) => {
	return { type: FETCH_ARTIST_GAME.start, artistId, level };
};

export const answerQuestion = (gameId, questionIdx, answerIdx) => {
	return { type: ANSWER_QUESTION, gameId, questionIdx, answerIdx };
};

export const setSongLyrics = (songId, newLyrics) => {
	return { type: SET_SONG_LYRICS.start, songId, newLyrics };
};

export const copyCloudSettings = (cloudSettings) => {
	return { type: COPY_CLOUD_SETTINGS, cloudSettings };
};
