import { createSelector } from 'reselect';

export const getUser = (state) => state.userInfo.user;
export const getSongsById = (state) => {
	const { byId } = state.songs;
	return byId;
};
export const getSongsList = createSelector(getSongsById, (songsById) => {
	return Object.values(songsById);
});
export const getAccessToken = createSelector(getUser, (user) => user.accessToken);
