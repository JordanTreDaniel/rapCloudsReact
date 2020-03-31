import { SET_SONGS } from "../actionTypes";

const initialState = {
  songs: [{ name: "Marvin's Room" }]
};

const setSongs = (state, action) => {
  const { songs } = action;
  console.log("set Songs!", songs);
  return Object.assign(state, { songs });
};

const handlers = {
  [SET_SONGS]: setSongs
};

export default (state = initialState, action) => {
  const handle = handlers[action.type];
  if (handle) return handle(state, action);
  return state;
};
