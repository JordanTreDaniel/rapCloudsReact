import { ADD_SONGS } from '../actionTypes';

const initialState = {
	byId: {}
};

const addSongs = (state, action) => {
	const { songs } = action;
	const songsById = songs.reduce((acc, song) => {
		acc[song.id] = song;
		return acc;
	}, {});

	return { ...state, byId: { ...state.byId, ...songsById } };
};

const handlers = {
	[ADD_SONGS]: addSongs
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
