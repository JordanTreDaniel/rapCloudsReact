import _normalizeLyrics from './normalizeLyrics';
import paths from '../../paths';
import intersection from 'lodash/intersection';

export const normalizeLyrics = _normalizeLyrics;

export const replaceDiacritics = (str) => {
	// NOTE: GREAT explanation of how this works here:
	// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
	const normedStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	return normedStr;
};
// whichPath - Takes the current location path, and matches it to a route pattern
// NOTE - I'm positive this algorithm could be improved
export const whichPath = (path) => {
	const splitPath = path.split('/').filter((s) => s.length);
	const routePatterns = Object.values(paths);
	const results = {};
	routePatterns.forEach((pattern) => {
		const paramSlots = (pattern.match(/:/g) || []).length;
		const splitPattern = pattern.split('/').filter((s) => s.length);
		let variations = 0;
		//A variation is when the path contains a string the pattern does not.
		//We can only allow this as many times as there are variables within the pattern.
		splitPath.forEach((pieceOfPath) => {
			const m = pattern.match(pieceOfPath);
			if (!m) {
				variations++;
			}
		});
		results[pattern] = {
			intersection: intersection(splitPath, splitPattern).length,
			lengthDifference: Math.abs(splitPath.length - splitPattern.length),
			tooManyVariations: variations > paramSlots,
		};
	});
	let chosenOne = {
		path: '',
		intersection: 0,
		lengthDifference: 0,
	};
	Object.entries(results).forEach(([ pattern, counts ]) => {
		if (
			(!counts.tooManyVariations && counts.intersection > chosenOne.intersection) ||
			counts.lengthDifference < chosenOne.lengthDifference
		) {
			chosenOne = {
				path: pattern,
				...counts,
			};
		}
	});

	return chosenOne.path;
};
