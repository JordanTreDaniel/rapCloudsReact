import { SET_USER, SET_HYDRATION_TRUE, SIGN_OUT } from '../actionTypes';

const initialState = {
	user: null,
	hydrated: false
};

const setUser = (state, action) => {
	const { user } = action;
	return Object.assign({}, state, { user });
};

const setHydration = (state, action) => {
	return Object.assign({}, state, { hydrated: true });
};

const signOut = (state, action) => {
	return Object.assign({}, initialState, { hydrated: true });
};

const handlers = {
	[SET_USER]: setUser,
	[SET_HYDRATION_TRUE]: setHydration,
	[SIGN_OUT]: signOut
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
