import { createSelector } from 'reselect';
import { normalizeLyrics, whichPath, replaceDiacritics } from './utils';
import { createMatchSelector } from 'connected-react-router';
import sortBy from 'lodash/sortBy';
import { initialState as cloudInitialState } from './reducers/clouds';
const { settings: initialCloudSettings } = cloudInitialState;
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
	},
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
	},
);

export const getUserName = createSelector(getUser, (user) => {
	const { name = null } = user || {};
	return name;
});

export const getUserMongoId = createSelector(getUser, (user) => {
	const { _id = null } = user || {};
	return _id;
});

//Songs
/********************************************************************* */
export const getSearchTerm = (state) => state.songs.searchTerm;
export const areSongsLoading = (state) => state.songs.loading;
export const isSongSearchLoading = (state) => state.songs.searchLoading;
export const isSongDetailLoading = (state) => state.songs.songDetailLoading;
export const isWordCloudLoading = (state) => state.songs.wordCloudLoading;
export const areSongLyricsLoading = (state) => state.songs.lyricsLoading;

export const getCurrentSongId = createSelector(getMatchParams, (matchParams) => {
	return matchParams.songId;
});

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
	},
);

export const getSongsList = createSelector(getSongsById, (songsById) => {
	return Object.values(songsById);
});

export const getNormedSearchTerm = createSelector(getSearchTerm, (rawSearchTerm) => {
	const preNormed = rawSearchTerm.toLowerCase().replace(/[.,/#!%^*;:{}=\-_`~()[\]]/g, '');
	const result = replaceDiacritics(preNormed);
	return result;
});

export const getSearchedSongsList = createSelector(
	getSongsList,
	getNormedSearchTerm,
	(songsList, normalizedSearchTerm) => {
		if (!normalizedSearchTerm.length) return songsList;
		const matchingSongs = songsList.reduce((matchingSongs, song) => {
			const normalizedTitle = replaceDiacritics(song.full_title.toLowerCase());
			const normalizedArtistName = replaceDiacritics(song.primary_artist.name.toLowerCase());
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
	},
);

export const getCurrentSong = createSelector(getSongsById, getCurrentSongId, (songsById, songId) => {
	if (!songId) {
		// console.warn(`The "getCurrentSong" selector has been called with no songId detected in match params`);
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
export const getArtistsById = (state) => state.artists.byId;
export const isArtistLoading = (state) => state.artists.artistLoading;
export const isArtistCloudLoading = (state) => state.artists.artistCloudLoading;

export const getArtistsSongs = createSelector(
	getSongsList,
	getMatchParams,
	getArtistsById,
	(songsList, matchParams, artistsById) => {
		const { artistId } = matchParams;
		if (!artistId) {
			// console.warn(`The "getArtistsSongs" selector has been called with no artistId detected in match params`);
			return [];
		}
		const artist = artistsById[artistId];
		const { name } = artist;
		const artistsSongs = songsList.filter((song) => {
			return (
				String(song.primary_artist.id) === String(artistId) ||
				(song.featured_artists &&
					song.featured_artists.some((artist) => String(artist.id) === String(artistId))) ||
				song.full_title.toLowerCase().match(name.toLowerCase())
			);
		});
		return artistsSongs;
	},
);
export const getArtistFromId = createSelector(
	getArtistsById,
	(_, artistId) => artistId,
	(artistsById, artistId) => artistsById[artistId],
);

export const getCurrentArtistId = createSelector(getMatchParams, (matchParams) => {
	const { artistId } = matchParams;
	if (!artistId) {
		// console.warn(`The "getCurrentArtistId" selector has been called with no artistId detected in match params`);
		return null;
	}
	return artistId;
});

export const getCurrentArtist = createSelector(getCurrentArtistId, getArtistsById, (artistId, artistsById) => {
	const currentArtist = artistsById[artistId];
	return currentArtist;
});

//Clouds
/********************************************************************* */
export const getCloudSettings = (state) => state.clouds.settings;
export const getCloudSettingsForFlight = createSelector(getCloudSettings, (settings) => {
	// Object.entries(settings).map((key, val) => {
	// 	const _type = typeof val;
	// 	if ([ 'string', 'number' ].includes(_type)) {
	// 		const stringVal = String(val);
	// 		settings[key] = stringVal.length ? stringVal : String(initialCloudSettings[key]);
	// 	}
	// });
	return {
		...settings,
		maskId: settings.maskDesired && settings.maskId ? settings.maskId : null,
		contourWidth: settings.contour ? settings.contourWidth : '0',
		width: String(settings.width).length ? settings.width : initialCloudSettings.width,
		height: String(settings.height).length ? settings.height : initialCloudSettings.height,
		whiteThreshold: String(settings.whiteThreshold).length
			? settings.whiteThreshold
			: initialCloudSettings.whiteThreshold,
		downSample: String(settings.downSample).length ? settings.downSample : initialCloudSettings.downSample,
	};
});

export const getMasksById = (state) => state.clouds.masksById;
export const areMasksLoading = (state) => state.clouds.masksLoading;
export const areCloudsLoading = (state) => state.clouds.cloudsLoading;
export const getMasks = createSelector(getMasksById, (masksById) => {
	const customMasks = [],
		stockMasks = [];
	Object.values(masksById).forEach((mask) => {
		if (mask.userId) {
			customMasks.push(mask);
		} else {
			stockMasks.push(mask);
		}
	});
	return [ ...customMasks, ...stockMasks ];
});
export const getCurrentMask = createSelector(
	getMasksById,
	getCloudSettings,
	(masksById, cloudSettings) => masksById[cloudSettings.maskId],
);
export const getCloudsById = (state) => state.clouds.byId;
export const getCloudFromId = createSelector(
	getCloudsById,
	(_, cloudId) => cloudId,
	(cloudsById, cloudId) => {
		return cloudsById[cloudId];
	},
);
export const getCloudsByArtistId = createSelector(getCloudsById, (cloudsById) => {
	Object.values(cloudsById).reduce((cloudsByArtistId, cloud) => {
		const { artistIds } = cloud;
		artistIds.forEach(
			(artistId) =>
				(cloudsByArtistId[artistId] = cloudsByArtistId[artistId]
					? [ ...cloudsByArtistId[artistId], cloud ]
					: [ cloud ]),
		);
		return cloudsByArtistId;
	}, {});
});
export const getCloudsBySongId = createSelector(getCloudsById, (cloudsById) => {
	Object.values(cloudsById).reduce((cloudsBySongId, cloud) => {
		const { songIds } = cloud;
		songIds.forEach(
			(songId) =>
				(cloudsBySongId[songId] = cloudsBySongId[songId] ? [ ...cloudsBySongId[songId], cloud ] : [ cloud ]),
		);
		return cloudsBySongId;
	}, {});
});

export const getCloudsForArtist = createSelector(
	getCloudsById,
	(_, artistId) => artistId,
	getCurrentArtistId,
	(cloudsById, artistId, currentArtistId) => {
		artistId = artistId ? artistId : currentArtistId;
		if (!artistId) console.warn(`Warning, getCloudsForArtist called without necessary arguments.`);
		return Object.values(cloudsById).filter((cloud) => cloud.artistIds.includes(artistId));
	},
);

export const getCloudsForSong = createSelector(
	getCloudsById,
	(_, songId) => songId,
	getCurrentSongId,
	(cloudsById, songId, currentSongId) => {
		songId = songId ? songId : currentSongId;
		if (!songId) console.warn(`Warning, getCloudsForSong called without necessary arguments.`);
		return Object.values(cloudsById).filter(
			(cloud) => cloud.songIds.includes(songId) && cloud.songIds.length === 1,
		);
	},
);
