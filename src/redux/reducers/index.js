import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import songs from './songs';
import userInfo from './userInfo';
import artists from './artists';

export default (history) => combineReducers({ router: connectRouter(history), songs, userInfo, artists });
