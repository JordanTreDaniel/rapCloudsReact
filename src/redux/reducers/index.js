import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import songs from './songs';
import userInfo from './userInfo';
import artists from './artists';
import clouds from './clouds';
import { SIGN_OUT } from '../actionTypes';

export default (history) => {
	const appReducer = combineReducers({ router: connectRouter(history), songs, userInfo, artists, clouds });

	const rootReducer = (state, action) => {
		if (action.type === SIGN_OUT) {
			state = undefined;
		}
		return appReducer(state, action);
	};
	return rootReducer;
};
