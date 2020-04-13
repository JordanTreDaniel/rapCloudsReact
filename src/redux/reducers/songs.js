import { ADD_SONGS } from '../actionTypes';

const initialState = {
	songs: []
};

const addSongs = (state, action) => {
	const { songs } = action;
	return Object.assign({}, state, { songs });
};

const handlers = {
	[ADD_SONGS]: addSongs
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
