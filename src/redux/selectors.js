import { createSelector } from 'reselect';
import { normalizeLyrics } from './utils';
//User
/********************************************************************* */
export const getUser = (state) => state.userInfo.user;
export const getAccessToken = createSelector(getUser, (user) => user && user.accessToken);
export const getUserImg = createSelector(
	getUser,
	(_, size) => size,
	(user, size) => {
		const { avatar = {} } = user || {};
		return avatar[size] && avatar[size]['url'];
	}
);

//Songs
/********************************************************************* */
export const getSearchTerm = (state) => state.songs.searchTerm;

export const getCurrentSongId = (state) => state.songs.currentSongId;

export const getSongsById = (state) => {
	const { byId } = state.songs;
	return byId;
};

export const getSongsList = createSelector(getSongsById, (songsById) => {
	return Object.values(songsById);
});

export const getSearchedSongsList = createSelector(getSongsList, getSearchTerm, (songsList, searchTerm) => {
	return searchTerm.length
		? songsList.filter((song) => {
				const normalizedTitle = song.full_title.toLowerCase();
				const normalizedArtistName = song.primary_artist.name.toLowerCase();
				const normalizedSearchTerm = searchTerm.toLowerCase().split(' ');
				return normalizedSearchTerm.some(
					(word) => normalizedTitle.match(word) || normalizedArtistName.match(word)
				);
			})
		: songsList;
});

//Artist
/********************************************************************* */
export const getArtistsSongs = createSelector(
	getSongsList,
	(_, artistId) => artistId,
	(songsList, artistId) => {
		const artistsSongs = songsList.filter((song) => String(song.primary_artist.id) === String(artistId));
		return artistsSongs;
	}
);

export const getArtistCloud = createSelector();
//get their songs
//result fn
//pattern-match the other cloud selector

export const getArtistsById = (state) => state.artists.byId;

export const getCurrentArtist = createSelector((_, artistId) => artistId, getArtistsById, (artistId, artistsById) => {
	const currentArtist = artistsById['148'];
	return currentArtist;
});

export const getCurrentSong = createSelector(getSongsById, getCurrentSongId, (songsById, songId) => {
	const song = songsById[songId] || {};
	let { lyrics = '' } = song;

	const normalizedLyrics = normalizeLyrics(lyrics);
	song.normalizedLyrics = normalizedLyrics;
	return song;
});

//General
/********************************************************************* */
export const isAppRehydrated = (state) => state.userInfo.hydrated; //TO-DO: Move hydration detection to 'general' reducer
