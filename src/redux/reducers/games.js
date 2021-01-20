import { FETCH_ARTIST_GAME } from '../actionTypes';

const initialState = {
	byId: {},
	gameLoading: false,
};

const loadingMap = {};

Object.values(FETCH_ARTIST_GAME).forEach((actionType) => (loadingMap[actionType] = 'gameLoading'));

const setLoading = (state, action) => {
	const { type } = action;
	const value = type.match('_START') ? true : false;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: value };
};

const addGame = (state, action) => {
	const { game } = action;
	const { artistId } = game;
	if (!game || !artistId) return state;
	const id = `${artistId}-${Date.now()}`;
	const gamesById = state.byId;
	return { ...state, byId: { ...gamesById, [id]: game }, gameLoading: false };
};

const handlers = {};
// Note: Easily set the handlers for each of the FETCH variations, since they mostly just manage loading states anyway.
Object.values(FETCH_ARTIST_GAME).forEach((actionType) => (handlers[actionType] = setLoading));
// Note: Be sure to over-write the .success variations of FETCH actions, like below.
handlers[FETCH_ARTIST_GAME.success] = addGame;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
