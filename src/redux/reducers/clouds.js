// import { FETCHCLOUD } from '../actionTypes';

import { UPDATE_CLOUD_SETTINGS, FETCH_MASKS, ADD_CUSTOM_MASK, RESET_CLOUD_DEFAULTS, DELETE_MASK } from '../actionTypes';

export const initialState = {
	byId: {},
	settings: {
		width: '400',
		height: '200',
		maskDesired: true,
		maskId: null,
		contour: false,
		contourWidth: '1',
		contourColor: '#ffffff',
		stopWords: [ 'and', 'but', 'the', 'to', 'if', 'it', 'of', 'at' ],
		background: true,
		backgroundColor: '#000000',
		colors: [], //this defaults to 'viridis' colormap i believe. Aka, empty color arr means use their default
		repeat: true,
		collocations: true,
		includeNumbers: true,
		detectEdges: true,
		colorFromMask: false,
		downSample: '1',
		whiteThreshold: '240',
		overlay: false,
	},
	masksById: {},
	masksLoading: false,
};

const loadingMap = {};
Object.values(FETCH_MASKS).forEach((actionType) => (loadingMap[actionType] = 'masksLoading'));
Object.values(ADD_CUSTOM_MASK).forEach((actionType) => (loadingMap[actionType] = 'masksLoading'));
Object.values(DELETE_MASK).forEach((actionType) => (loadingMap[actionType] = 'masksLoading'));

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

const deleteMask = (state, action) => {
	const { maskId } = action;
	if (!maskId) return state;
	const { masksById } = state;
	delete masksById[maskId];
	return {
		...state,
		masksById: { ...masksById },
		settings: { ...state.settings, maskId: maskId === state.settings.maskId ? null : state.settings.maskId },
	};
};

const addMasks = (state, action) => {
	const { masks } = action;
	return {
		...state,
		masksById:
			masks && masks.length
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
Object.values(FETCH_MASKS).forEach((actionType) => (handlers[actionType] = setLoading));
Object.values(ADD_CUSTOM_MASK).forEach((actionType) => (handlers[actionType] = setLoading));
Object.values(DELETE_MASK).forEach((actionType) => (handlers[actionType] = setLoading));
// handlers[FETCHCLOUD.success] = addCloud;
handlers[UPDATE_CLOUD_SETTINGS] = updateCloudSettings;
handlers[FETCH_MASKS.success] = addMasks;
handlers[ADD_CUSTOM_MASK.success] = addCustomMask;
handlers[DELETE_MASK.success] = deleteMask;
handlers[RESET_CLOUD_DEFAULTS] = resetCloudDefaults;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
