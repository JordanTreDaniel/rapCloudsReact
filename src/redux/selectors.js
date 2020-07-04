import { createSelector } from 'reselect';
import { normalizeLyrics, whichPath } from './utils';
import { createMatchSelector } from 'connected-react-router';

//General
/********************************************************************* */
export const isAppRehydrated = (state) => state.userInfo.hydrated; //TO-DO: Move hydration detection to 'general' reducer

export const getCurrentPath = (state) => {
	const { pathname } = state.router.location;
	return pathname;
};

export const getMatchParams = createSelector(
	getCurrentPath,
	(state) => state,
	(currentPath, state) => {
		const routePattern = whichPath(currentPath);
		const match = createMatchSelector(routePattern)(state);
		return (match && match.params) || {};
	}
);

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
export const areSongsLoading = (state) => state.songs.loading;

export const getCurrentSongId = createSelector(getMatchParams, (matchParams) => matchParams.songId);

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
export const getArtistsSongs = createSelector(getSongsList, getMatchParams, (songsList, matchParams) => {
	const { artistId } = matchParams;
	if (!artistId) {
		console.warn(`The "getArtistsSongs" selector has been called with no artistId detected in match params`);
		return [];
	}
	const artistsSongs = songsList.filter((song) => String(song.primary_artist.id) === String(artistId));
	return artistsSongs;
});

export const getArtistCloud = createSelector();
//get their songs
//result fn
//pattern-match the other cloud selector

export const getArtistsById = (state) => state.artists.byId;

export const getCurrentArtist = createSelector(getMatchParams, getArtistsById, (matchParams, artistsById) => {
	const { artistId } = matchParams;
	if (!artistId) {
		console.warn(`The "getCurrentArtist" selector has been called with no artistId detected in match params`);
		return null;
	}
	const currentArtist = artistsById[artistId];
	return currentArtist;
});

export const getCurrentSong = createSelector(getSongsById, getCurrentSongId, (songsById, songId) => {
	if (!songId) {
		console.warn(`The "getCurrentSong" selector has been called with no songId detected in match params`);
		return null;
	}
	const song = songsById[songId] || {};
	let { lyrics = '' } = song;

	const normalizedLyrics = normalizeLyrics(lyrics);
	song.normalizedLyrics = normalizedLyrics;
	return song;
});
