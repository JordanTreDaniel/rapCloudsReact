// import { generateCloud } from '../actionTypes';

import {
	UPDATE_CLOUD_SETTINGS,
	FETCH_MASKS,
	ADD_CUSTOM_MASK,
	RESET_CLOUD_DEFAULTS,
	DELETE_MASK,
	GEN_SONG_CLOUD,
	GEN_ARTIST_CLOUD,
	DELETE_CLOUDS,
	FETCH_CLOUDS,
	ADD_CLOUD,
	ADD_CLOUDS,
	FETCH_GOOGLE_FONTS,
	SET_FONT_SEARCH_TERM,
	SET_CURRENT_FONT_NAME,
} from "../actionTypes";

export const initialState = {
	byId: {},
	cloudsLoading: false,
	masksById: {},
	masksLoading: false,
	fonts: [],
	fontSearchTerm: "",
	currentFontName: null,
	settings: {
		fontDesired: false,
		backgroundColor: "#000000",
		collocations: true,
		coloredBackground: true,
		colorFromMask: false,
		colors: ["#64c1ff", "#0091ea", "#0064b7", "#f5f5f5", "#6d6d6d"], //this defaults to 'viridis' colormap i believe. Aka, empty color arr means use their default
		contour: false,
		contourColor: "#ffffff",
		contourWidth: "1",
		detectEdges: true,
		downSample: "1",
		height: "200",
		includeNumbers: true,
		maskAsBackground: false,
		maskDesired: false,
		maskId: null,
		preferHorizontal: 60,
		private: true,
		repeat: true,
		stopWords: ["and", "but", "the", "to", "if", "it", "of", "at"],
		transparentBackground: false,
		useCustomColors: true,
		useRandomColors: false,
		whiteThreshold: "240",
		width: "400",
	},
};

const loadingMap = {};
Object.values(FETCH_MASKS).forEach(
	(actionType) => (loadingMap[actionType] = "masksLoading")
);
Object.values(ADD_CUSTOM_MASK).forEach(
	(actionType) => (loadingMap[actionType] = "masksLoading")
);
Object.values(DELETE_MASK).forEach(
	(actionType) => (loadingMap[actionType] = "masksLoading")
);
Object.values(DELETE_CLOUDS).forEach(
	(actionType) => (loadingMap[actionType] = "cloudsLoading")
);

const setLoading = (state, action) => {
	const { type } = action;
	const value = type.match("_START") ? true : false;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: value };
};

const addGoogleFonts = (state, action) => {
	const { fonts } = action;
	return { ...state, fonts };
};

const setFontSearchTerm = (state, action) => {
	const { searchTerm } = action;
	return { ...state, fontSearchTerm: searchTerm };
};

const setCurrentFontName = (state, action) => {
	const { fontName } = action;
	return { ...state, currentFontName: fontName };
};

const addCloud = (state, action) => {
	const { finishedCloud } = action;
	const { artistIds, songIds, id } = finishedCloud;
	if (!artistIds.length || !songIds.length) {
		console.error("Could not save cloud without artist & song id's");
		return state;
	}
	const cloudsById = state.byId;
	return {
		...state,
		byId: { ...cloudsById, [id]: finishedCloud },
		cloudsLoading: false,
	};
};

const addClouds = (state, action) => {
	const { clouds } = action;
	if (!clouds || !clouds.length) return state;
	const newCloudsById = clouds.reduce((newCloudsById, cloud) => {
		const { id } = cloud;
		newCloudsById[id] = cloud;
		return newCloudsById;
	}, {});
	return {
		...state,
		byId: { ...state.byId, ...newCloudsById },
		cloudsLoading: false,
	};
};

const replaceClouds = (state, action) => {
	const { clouds } = action;
	if (!clouds) return state;
	const cloudsById = clouds.reduce((cloudsById, cloud) => {
		const { id } = cloud;
		cloudsById[id] = cloud;
		return cloudsById;
	}, {});
	return { ...state, byId: cloudsById, cloudsLoading: false };
};

const removeClouds = (state, action) => {
	const { cloudIds } = action;
	if (!cloudIds) {
		console.error("Could not delete cloud without cloudIds");
		return state;
	}
	const cloudsById = state.byId;
	for (const cloudId of cloudIds) {
		delete cloudsById[cloudId];
	}
	return { ...state, byId: { ...cloudsById }, cloudsLoading: false };
};

const updateCloudSettings = (state, action) => {
	const mutallyExclPropSets = [
		["coloredBackground", "transparentBackground", "maskAsBackground"],
		["useCustomColors", "colorFromMask", "useRandomColors"],
	];
	const { key, val } = action;
	const newSettings = { ...state.settings, [key]: val };
	mutallyExclPropSets.forEach((mutallyExclProps) => {
		const propIdx = mutallyExclProps.indexOf(key);
		if (propIdx === -1) return;
		mutallyExclProps.forEach((prop, idx) => {
			if (idx === propIdx) return;
			newSettings[prop] = val ? false : state.settings[prop];
		});
	});

	//Settings that require mask in order to be "on"
	newSettings["contour"] =
		newSettings.contour &&
		newSettings.coloredBackground &&
		newSettings.maskId &&
		newSettings.maskDesired;
	newSettings["maskAsBackground"] =
		newSettings.maskAsBackground &&
		newSettings.maskId &&
		newSettings.maskDesired;
	newSettings["colorFromMask"] =
		newSettings.colorFromMask && newSettings.maskId && newSettings.maskDesired;

	//Defaults for mutually exlc prop sets
	newSettings["transparentBackground"] =
		newSettings.transparentBackground ||
		(!newSettings.coloredBackground && !newSettings.maskAsBackground);
	newSettings["useCustomColors"] =
		newSettings.useCustomColors ||
		(!newSettings.useRandomColors && !newSettings.colorFromMask);

	// newSettings
	return { ...state, settings: newSettings };
};

const deleteMask = (state, action) => {
	const { maskId } = action;
	if (!maskId) return state;
	const { masksById } = state;
	delete masksById[maskId];
	return {
		...state,
		masksById: { ...masksById },
		settings: {
			...state.settings,
			maskId: maskId === state.settings.maskId ? null : state.settings.maskId,
		},
	};
};

const addMasks = (state, action) => {
	const { masks } = action;
	return {
		...state,
		masksById: masks
			? masks.reduce((masksById, mask) => {
					const { id } = mask;
					masksById[id] = mask;
					return masksById;
			  }, {})
			: state.masksById,
		masksLoading: false,
	};
};

const addCustomMask = (state, action) => {
	const { mask } = action;
	if (!mask) return state;
	return {
		...state,
		masksById: { ...state.masksById, [mask.id]: mask },
		settings: { ...state.settings, maskId: mask.id },
		masksLoading: false,
	};
};

const resetCloudDefaults = (state, action) => {
	return {
		...state,
		settings: initialState.settings,
	};
};

const handlers = {};
Object.values(FETCH_MASKS).forEach(
	(actionType) => (handlers[actionType] = setLoading)
);
Object.values(ADD_CUSTOM_MASK).forEach(
	(actionType) => (handlers[actionType] = setLoading)
);
Object.values(DELETE_MASK).forEach(
	(actionType) => (handlers[actionType] = setLoading)
);
Object.values(DELETE_CLOUDS).forEach(
	(actionType) => (handlers[actionType] = setLoading)
);
// handlers[generateCloud.success] = addCloud;
handlers[UPDATE_CLOUD_SETTINGS] = updateCloudSettings;
handlers[FETCH_MASKS.success] = addMasks;
handlers[ADD_CUSTOM_MASK.success] = addCustomMask;
handlers[DELETE_MASK.success] = deleteMask;
handlers[RESET_CLOUD_DEFAULTS] = resetCloudDefaults;
handlers[GEN_SONG_CLOUD.success] = addCloud;
handlers[GEN_ARTIST_CLOUD.success] = addCloud;
handlers[FETCH_GOOGLE_FONTS.success] = addGoogleFonts;
handlers[ADD_CLOUD] = addCloud;
handlers[DELETE_CLOUDS.success] = removeClouds;
handlers[FETCH_CLOUDS.success] = replaceClouds;
handlers[ADD_CLOUDS] = addClouds;
handlers[SET_FONT_SEARCH_TERM] = setFontSearchTerm;
handlers[SET_CURRENT_FONT_NAME] = setCurrentFontName;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
