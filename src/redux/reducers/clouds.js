// import { FETCHCLOUD } from '../actionTypes';

const initialState = {
	byId: {},
	settings: {
		width: '400',
		height: '200',
		maskId: null,
		contourWidth: 0,
		contourColor: 'black',
		stopWords: [ 'and', 'but', 'the', 'to', 'if', 'it', 'of', 'at' ],
		showBackground: true,
		backgroundColor: 'black',
		colors: [], //this defaults to 'viridis' colormap i believe. Aka, empty color arr means use their default
		repeat: false,
		collocations: true,
	},
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

const handlers = {};

// handlers[FETCHCLOUD.success] = addCloud;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
