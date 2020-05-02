import { ADD_ARTIST } from '../actionTypes';

const initialState = {
	byId: {},
	currentArtistId: null
};

const addArtist = (state, action) => {
	const { songs } = action;
	const songsById = songs.reduce((acc, song) => {
		acc[song.id] = song;
		return acc;
	}, {});

	return { ...state, byId: { ...state.byId, ...songsById } };
};

const handlers = {
	[ADD_ARTIST]: addArtist
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
