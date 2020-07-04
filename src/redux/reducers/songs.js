import { ADD_SONGS, ADD_SONG_DETAILS, SET_SONG_SEARCH_TERM, SEARCH_SONGS } from '../actionTypes';

const initialState = {
	byId: {},
	currentSongId: null,
	searchTerm: '',
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

	return { ...state, byId: { ...state.byId, ...songsById } };
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

const toggleLoading = (state, action) => {
	console.log("this is toggle Loading");
	const { isLoading } = action;
	console.log(isLoading);
	return { ...state, loading: isLoading };
};


const handlers = {
	[ADD_SONGS]: addSongs,
	[ADD_SONG_DETAILS]: addSongDetails,
	[SET_SONG_SEARCH_TERM]: setSearchTerm,
	[SEARCH_SONGS]: toggleLoading
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
