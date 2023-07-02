const actionNamesForProcess = (baseName) => {
	return {
		failure: `${baseName}_FAILURE`,
		success: `${baseName}_SUCCESS`,
		start: `${baseName}_START`,
		cancellation: `${baseName}_CANCELLATION`,
	};
};
export const SET_USER = "SET_USER";
export const ADD_SONGS = "ADD_SONGS";
export const ADD_ARTISTS = "ADD_ARTISTS";
export const MODIFY_ARTIST = "MODIFY_ARTIST";
export const ADD_CLOUD = "ADD_CLOUD";
export const ADD_CLOUDS = "ADD_CLOUDS";
export const SEARCH_SONGS = actionNamesForProcess("SEARCH_SONGS");
export const GEN_SONG_CLOUD = actionNamesForProcess("GEN_SONG_CLOUD");
export const GEN_ARTIST_CLOUD = actionNamesForProcess("GEN_ARTIST_CLOUD");
export const FETCH_SONG_DETAILS = actionNamesForProcess("FETCH_SONG_DETAILS");
export const SET_SONG_SEARCH_TERM = "SET_SONG_SEARCH_TERM";
export const SET_HYDRATION_TRUE = "SET_HYDRATION_TRUE";
export const FETCH_ARTIST = actionNamesForProcess("FETCH_ARTIST");
export const FETCH_ARTIST_SONGS = actionNamesForProcess("FETCH_ARTIST_SONGS");
export const FETCH_SONG_LYRICS = actionNamesForProcess("FETCH_SONG_LYRICS");
export const FETCH_GOOGLE_FONTS = actionNamesForProcess("FETCH_GOOGLE_FONTS");
export const FETCH_MASKS = actionNamesForProcess("FETCH_MASKS");
export const ADD_CUSTOM_MASK = actionNamesForProcess("ADD_CUSTOM_MASK");
export const DELETE_MASK = actionNamesForProcess("DELETE_MASK");
export const UPDATE_USER = actionNamesForProcess("UPDATE_USER");
export const FETCH_CLOUDS = actionNamesForProcess("FETCH_CLOUDS");
export const DELETE_CLOUDS = actionNamesForProcess("DELETE_CLOUDS");
export const FETCH_ARTIST_GAME = actionNamesForProcess("FETCH_ARTIST_GAME");
export const RESET_GAME = "RESET_GAME";
export const SET_SONG_LYRICS = actionNamesForProcess("SET_SONG_LYRICS");
export const SIGN_OUT = "SIGN_OUT";
export const COPY_CLOUD_SETTINGS = "COPY_CLOUD_SETTINGS";
export const SET_FONT_SEARCH_TERM = "SET_FONT_SEARCH_TERM";
export const SET_CURRENT_FONT_NAME = "SET_CURRENT_FONT_NAME";
export const DO_NOTHING = "DO_NOTHING";
export const UPDATE_CLOUD_SETTINGS = "UPDATE_CLOUD_SETTINGS";
export const RESET_CLOUD_DEFAULTS = "RESET_CLOUD_DEFAULTS";
export const ANSWER_QUESTION = "ANSWER_QUESTION";
