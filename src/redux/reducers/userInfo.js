import { SET_USER } from "../actionTypes";

const initialState = {
  user: { name: "Jordan" }
};

const setUser = (state, action) => {
  const { user } = action;
  console.log("set User!", user);
  return Object.assign(state, { user });
};

const handlers = {
  [SET_USER]: setUser
};

export default (state = initialState, action) => {
  const handle = handlers[action.type];
  if (handle) return handle(state, action);
  return state;
};
