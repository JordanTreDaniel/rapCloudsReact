import { ADD_SONGS, ADD_SONG_DETAILS, FETCH_SONG_DETAILS } from '../actionTypes';

const initialState = {
	byId: {},
	currentSongId: null
};

const addSongs = (state, action) => {
	const { songs } = action;
	const songsById = songs.reduce((acc, song) => {
		acc[song.id] = song;
		return acc;
	}, {});

	return { ...state, byId: { ...state.byId, ...songsById } };
};

const setCurrentSongId = (state, action) => {
	const { songId = null } = action;
	return { ...state, currentSongId: songId };
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
	[FETCH_SONG_DETAILS]: setCurrentSongId
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
