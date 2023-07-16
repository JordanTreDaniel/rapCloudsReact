import { SET_LOCATION } from '../actionTypes';

const initialState = {
    location: {
        "pathname": "/",
        "search": "",
        "hash": "",
        "state": null,
    }
};

const setLocation = (state, action) => {
	const { location } = action;
	return Object.assign({}, state, {location});
};

const handlers = {
	[SET_LOCATION]: setLocation,
};

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
