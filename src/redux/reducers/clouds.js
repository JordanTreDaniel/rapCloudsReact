// import { FETCHCLOUD } from '../actionTypes';

import { UPDATE_CLOUD_SETTINGS, FETCH_MASKS, ADD_CUSTOM_MASK, RESET_CLOUD_DEFAULTS } from '../actionTypes';

export const initialState = {
	byId: {},
	settings: {
		width: '400',
		height: '200',
		maskDesired: true,
		maskId: null,
		contour: false,
		contourWidth: '0',
		contourColor: '#ffffff',
		stopWords: [ 'and', 'but', 'the', 'to', 'if', 'it', 'of', 'at' ],
		background: true,
		backgroundColor: '#000000',
		colors: [ '#64c1ff', '#0091ea', '#0064b7', '#f5f5f5', '#6d6d6d' ], //this defaults to 'viridis' colormap i believe. Aka, empty color arr means use their default
		repeat: true,
		collocations: true,
		includeNumbers: true,
		detectEdges: true,
		colorFromMask: false,
		downSample: '0',
		whiteThreshold: '240',
	},
	masksById: {},
	masksLoading: false,
};

const loadingMap = {};
Object.values(FETCH_MASKS).forEach((actionType) => (loadingMap[actionType] = 'masksLoading'));
Object.values(ADD_CUSTOM_MASK).forEach((actionType) => (loadingMap[actionType] = 'masksLoading'));

const setLoading = (state, action) => {
	const { type } = action;
	const value = type.match('_START') ? true : false;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: value };
};

// const addCloud = (state, action) => {
// 	const { artistId, songIds, cloud } = action;
// 	if (!artistId || !songIds.length) {
// 		console.error("Could not save cloud without artist & song id's");
// 		return state;
// 	}
// 	const cloudsById = state.byId;
// 	return { ...state, byId: { ...cloudsById, [id]: cloud } };
// };

const updateCloudSettings = (state, action) => {
	const { key, val } = action;
	return { ...state, settings: { ...state.settings, [key]: val } };
};

const addMasks = (state, action) => {
	const { masks } = action;
	if (!masks || !masks.length) return state;
	return {
		...state,
		masksById: masks.reduce((masksById, mask) => {
			const { id } = mask;
			masksById[id] = mask;
			return masksById;
		}, {}),
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
	};
};

const resetCloudDefaults = (state, action) => {
	return {
		...state,
		settings: initialState.settings,
	};
};

const handlers = {};
Object.values(FETCH_MASKS).forEach((actionType) => (handlers[actionType] = setLoading));
Object.values(ADD_CUSTOM_MASK).forEach((actionType) => (handlers[actionType] = setLoading));
// handlers[FETCHCLOUD.success] = addCloud;
handlers[UPDATE_CLOUD_SETTINGS] = updateCloudSettings;
handlers[FETCH_MASKS.success] = addMasks;
handlers[ADD_CUSTOM_MASK.success] = addCustomMask;
handlers[RESET_CLOUD_DEFAULTS] = resetCloudDefaults;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
