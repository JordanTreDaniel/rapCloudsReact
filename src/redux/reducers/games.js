import { FETCH_ARTIST_GAME, ANSWER_QUESTION } from '../actionTypes';

const initialState = {
	byId: {},
	gameLoading: false,
};

const loadingMap = {};

Object.values(FETCH_ARTIST_GAME).forEach((actionType) => (loadingMap[actionType] = 'gameLoading'));

const setLoading = (state, action) => {
	const { type } = action;
	const value = type.match('_START') ? true : false;
	const loadingProperty = loadingMap[type];
	return { ...state, [loadingProperty]: value };
};

const addGame = (state, action) => {
	const { game } = action;
	const { artistId, level } = game;
	if (!game || !artistId) return state;
	const id = `${artistId}-${level}`;
	game.id = id;
	const gamesById = state.byId;
	return { ...state, byId: { ...gamesById, [id]: game }, gameLoading: false };
};

const answerQuestion = (state, action) => {
	const { gameId, questionIdx, answerIdx } = action;
	const game = state.byId[gameId];
	if ((!gameId || !game || !String(questionIdx), !String(answerIdx))) return state;
	// game.questions[questionIdx].answerIdx = answerIdx;
	let { questions } = game;
	questions = [ ...questions ];
	questions.splice(questionIdx, 1, { ...questions[questionIdx], answerIdx });
	return {
		...state,
		byId: { ...state.byId, [gameId]: { ...game, questions } },
	};
};

const handlers = {};
// Note: Easily set the handlers for each of the FETCH variations, since they mostly just manage loading states anyway.
Object.values(FETCH_ARTIST_GAME).forEach((actionType) => (handlers[actionType] = setLoading));
// Note: Be sure to over-write the .success variations of FETCH actions, like below.
handlers[FETCH_ARTIST_GAME.success] = addGame;
handlers[ANSWER_QUESTION] = answerQuestion;

export default (state = initialState, action) => {
	const handle = handlers[action.type];
	if (handle) return handle(state, action);
	return state;
};
