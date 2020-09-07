import { FETCH_ARTIST } from '../actionTypes';

const initialState = {
	byId: {},
	artistLoading: false
};

const loadingMap = {};
Object.values(FETCH_ARTIST).forEach((actionType) => (loadingMap[actionType] = 'artistLoading'));

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

const addArtist = (state, action) => {
	const { artist } = action;
	const { id } = artist;
	if (!artist || !id) return state;
	const artistsById = state.byId;
	return { ...state, byId: { ...artistsById, [id]: artist }, artistLoading: false };
};

const handlers = {
	[FETCH_ARTIST.success]: addArtist,
	[FETCH_ARTIST.start]: setLoadingTrue,
	[FETCH_ARTIST.failure]: setLoadingFalse,
	[FETCH_ARTIST.cancellation]: setLoadingFalse
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
