import { createSelector } from 'reselect';

export const getUser = (state) => state.userInfo.user;
export const getSongsById = (state) => {
	const { byId } = state.songs;
	return byId;
};

export const getCurrentSongId = (state) => state.songs.currentSongId;
export const getSongsList = createSelector(getSongsById, (songsById) => {
	return Object.values(songsById);
});

export const getCurrentSong = createSelector(getSongsById, getCurrentSongId, (songsById, songId) => {
	const song = songsById[songId];
	console.log('SELECTING', { song, songId, songsById });
	return song;
});

export const getAccessToken = createSelector(getUser, (user) => user.accessToken);
