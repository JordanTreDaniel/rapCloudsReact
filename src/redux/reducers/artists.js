import { FETCH_ARTIST, FETCH_ARTIST_CLOUD } from '../actionTypes';

const initialState = {
	byId: {},
	artistLoading: false,
	artistCloudLoading: false
};

const loadingMap = {};
Object.values(FETCH_ARTIST).forEach((actionType) => (loadingMap[actionType] = 'artistLoading'));
Object.values(FETCH_ARTIST_CLOUD).forEach((actionType) => (loadingMap[actionType] = 'artistCloudLoading'));

const setLoading = (state, action) => {
	const { type } = action;
	const value = type.match('_START') ? true : false;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: value };
};

const addArtist = (state, action) => {
	const { artist } = action;
	const { id } = artist;
	if (!artist || !id) return state;
	const artistsById = state.byId;
	return { ...state, byId: { ...artistsById, [id]: artist }, artistLoading: false };
};

const addArtistCloud = (state, action) => {
	const { artistId, encodedCloud } = action;
	const artistsById = state.byId;
	const artist = artistsById[artistId];
	if (!artistId || !artist) {
		console.warn('Failed to save artist cloud', artistId);
		return state;
	}
	artist.encodedCloud = encodedCloud;
	return { ...state, byId: { ...artistsById, [artistId]: artist }, artistCloudLoading: false };
};

const handlers = {};
// Note: Easily set the handlers for each of the FETCH variations, since they mostly just manage loading states anyway.
Object.values(FETCH_ARTIST).forEach((actionType) => (handlers[actionType] = setLoading));
Object.values(FETCH_ARTIST_CLOUD).forEach((actionType) => (handlers[actionType] = setLoading));
// Note: Be sure to over-write the .success variations of FETCH actions, like below.
handlers[FETCH_ARTIST.success] = addArtist;
handlers[FETCH_ARTIST_CLOUD.success] = addArtistCloud;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
