import { combineReducers } from "redux";
import songs from "./songs";
import userInfo from "./userInfo";

export default combineReducers({ songs, userInfo });
