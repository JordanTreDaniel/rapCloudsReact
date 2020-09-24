import { createSelector } from 'reselect';
import { normalizeLyrics, whichPath } from './utils';
import { createMatchSelector } from 'connected-react-router';
import sortBy from 'lodash/sortBy';

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

export const getUserName = createSelector(getUser, (user) => {
	const { name = 'Our Favorite User' } = user || {};
	return name;
});

//Songs
/********************************************************************* */
export const getSearchTerm = (state) => state.songs.searchTerm;
export const areSongsLoading = (state) => state.songs.loading;
export const isSongSearchLoading = (state) => state.songs.searchLoading;
export const isSongDetailLoading = (state) => state.songs.songDetailLoading;
export const isWordCloudLoading = (state) => state.songs.wordCloudLoading;

export const getCurrentSongId = createSelector(getMatchParams, (matchParams) => matchParams.songId);

export const getSongsById = (state) => {
	const { byId } = state.songs;
	return byId;
};

export const getSongFromId = createSelector(
	getSongsById,
	(_, songId) => songId,
	(songsById, songId) => {
		const song = songsById[songId];
		return song ? { ...song } : null;
	}
);

export const getSongsList = createSelector(getSongsById, (songsById) => {
	return Object.values(songsById);
});

export const getNormedSearchTerm = createSelector(getSearchTerm, (rawSearchTerm) => {
	return rawSearchTerm.toLowerCase().replace(/[.,\/#!%\^\*;:{}=\-_`~()\[\]]/g, '');
});

export const getSearchedSongsList = createSelector(
	getSongsList,
	getNormedSearchTerm,
	(songsList, normalizedSearchTerm) => {
		if (!normalizedSearchTerm.length) return songsList;
		const matchingSongs = songsList.reduce((matchingSongs, song) => {
			const normalizedTitle = song.full_title.toLowerCase();
			const normalizedArtistName = song.primary_artist.name.toLowerCase();
			const searchTermItems = normalizedSearchTerm.split(' ');
			let isMatch = false;
			let searchRank = 0;
			searchTermItems.forEach((word) => {
				const titleMatch = normalizedTitle.match(word);
				const artistMatch = normalizedArtistName.match(word);
				if (titleMatch || artistMatch) isMatch = true;
				searchRank += titleMatch ? titleMatch[0].length * 2 : 0;
				searchRank += artistMatch ? artistMatch[0].length : 0;
			});
			if (!isMatch) return matchingSongs;
			const rankedSong = { ...song, searchRank };
			matchingSongs.push(rankedSong);
			return matchingSongs;
		}, []);
		return sortBy(matchingSongs, (song) => song.searchRank).reverse();
	}
);

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

export const getArtistFromId = createSelector(
	getArtistsById,
	(_, artistId) => artistId,
	(artistsById, artistId) => artistsById[artistId]
);
export const getCurrentArtist = createSelector(getMatchParams, getArtistsById, (matchParams, artistsById) => {
	const { artistId } = matchParams;
	if (!artistId) {
		console.warn(`The "getCurrentArtist" selector has been called with no artistId detected in match params`);
		return null;
	}
	const currentArtist = artistsById[artistId];
	return currentArtist;
});

export const isArtistLoading = (state) => state.artists.artistLoading;
