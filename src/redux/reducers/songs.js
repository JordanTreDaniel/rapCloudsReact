import { ADD_SONGS, ADD_SONG_DETAILS, FETCH_SONG_DETAILS, SET_SONG_SEARCH_TERM } from '../actionTypes';

const initialState = {
	byId: {},
	currentSongId: null,
	searchTerm: ''
};

const addSongs = (state, action) => {
	const { songs } = action;
	const songsById = songs.reduce((acc, song) => {
		const existingVersion = state.byId[song.id];
		if (existingVersion) {
			song = { ...existingVersion, ...song };
		}
		acc[song.id] = song;
		return acc;
	}, {});

	return { ...state, byId: { ...state.byId, ...songsById } };
};

const setCurrentSongId = (state, action) => {
	const { songId = null } = action;
	return { ...state, currentSongId: songId };
};

/**
 * 1. Install connected-react-router
 * 2. Install code from iRoute that Helps with this
 * 3. Derive paramProps from the selector
 */
const setCurrentArtistId = (state, action) => {
	const { songId = null } = action;
	return { ...state, currentSongId: songId };
};

const setSearchTerm = (state, action) => {
	const { searchTerm } = action;
	return { ...state, searchTerm: String(searchTerm) };
};

const addSongDetails = (state, action) => {
	const { song } = action;
	if (!song) return state;
	const { id: songId } = song;
	const songsById = state.byId;
	const oldSong = songsById[songId];
	const mergedSong = { ...oldSong, ...song };
	songsById[songId] = mergedSong;
	return { ...state, byId: { ...songsById } };
};

const handlers = {
	[ADD_SONGS]: addSongs,
	[ADD_SONG_DETAILS]: addSongDetails,
	[FETCH_SONG_DETAILS]: setCurrentSongId,
	[SET_SONG_SEARCH_TERM]: setSearchTerm
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
