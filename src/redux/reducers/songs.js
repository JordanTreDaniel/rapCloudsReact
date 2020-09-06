import {
	ADD_SONGS,
	ADD_SONG_DETAILS,
	SET_SONG_SEARCH_TERM,
	SEARCH_SONGS,
	SEARCH_SONGS_FAILURE,
	FETCH_SONG_DETAILS,
	FETCH_SONG_DETAILS_FAILURE,
	FETCH_WORD_CLOUD_FAILURE,
	SET_LOADING_FALSE
} from '../actionTypes';

const initialState = {
	byId: {},
	currentSongId: null,
	searchTerm: '',
	searchLoading: false,
	loading: false
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

	return { ...state, searchLoading: false, byId: { ...state.byId, ...songsById } };
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
	return { ...state, byId: { ...songsById }, loading: false };
};

const loadingMap = {
	[SEARCH_SONGS]: 'searchLoading',
	[SEARCH_SONGS_FAILURE]: 'searchLoading'
};

const setLoadingTrue = (state, action) => {
	const { type } = action;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: true };
};

const setLoadingFalse = (state, action) => {
	const { type } = action;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: false };
};

const handlers = {
	[ADD_SONGS]: addSongs,
	[ADD_SONG_DETAILS]: addSongDetails,
	[SET_SONG_SEARCH_TERM]: setSearchTerm,
	[SEARCH_SONGS]: setLoadingTrue,
	[SET_LOADING_FALSE]: setLoadingFalse,
	[SEARCH_SONGS_FAILURE]: setLoadingFalse,
	[FETCH_SONG_DETAILS]: setLoadingTrue,
	[FETCH_SONG_DETAILS_FAILURE]: setLoadingFalse,
	[FETCH_WORD_CLOUD_FAILURE]: setLoadingFalse
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
