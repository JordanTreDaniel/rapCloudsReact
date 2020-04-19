import { SET_USER, SET_HYDRATION_TRUE } from '../actionTypes';

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

const handlers = {
	[SET_USER]: setUser,
	[SET_HYDRATION_TRUE]: setHydration
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
