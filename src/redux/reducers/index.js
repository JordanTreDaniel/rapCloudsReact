import { combineReducers } from 'redux';
import songs from './songs';
import userInfo from './userInfo';
import artists from './artists';
import clouds from './clouds';
import games from './games';
import router from './router';
import { SIGN_OUT } from '../actionTypes';

export default () => {
	const appReducer = combineReducers({ songs, userInfo, artists, clouds, games, router });

	const rootReducer = (state, action) => {
		if (action.type === SIGN_OUT) {
			state = undefined;
		}
		return appReducer(state, action);
	};
	return rootReducer;
};
