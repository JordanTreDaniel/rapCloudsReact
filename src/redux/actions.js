import { SET_USER, SET_SONGS, FETCH_USER } from "./actionTypes";

export const setUser = (user = { name: "Tupac" }) => {
  return { type: SET_USER, user };
};

export const setSongs = (songs = [{ name: "We finally made it." }]) => {
  return { type: SET_SONGS, songs };
};

export const fetchUser = () => {
  return { type: FETCH_USER };
};
