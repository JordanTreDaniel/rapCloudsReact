import { combineReducers } from 'redux';
import songs from './songs';
import userInfo from './userInfo';
import artists from './artists';

export default combineReducers({ songs, userInfo, artists });
