import { ADD_ARTIST } from '../actionTypes';

const initialState = {
	byId: {},
	currentArtistId: null
};

const addArtist = (state, action) => {
	const { artist } = action;
	const { id } = artist;
	if (!artist || !id) return state;
	const artistsById = state.byId;
	return { ...state, byId: { ...artistsById, [id]: artist } };
};

const handlers = {
	[ADD_ARTIST]: addArtist
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
