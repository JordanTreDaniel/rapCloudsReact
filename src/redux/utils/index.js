import _normalizeLyrics from './normalizeLyrics';
import paths from '../../paths';
import intersection from 'lodash/intersection';

export const normalizeLyrics = _normalizeLyrics;

// whichPath - Takes the current location path, and matches it to a route pattern
// NOTE - I'm positive this algorithm could be improved
export const whichPath = (path) => {
	const splitPath = path.split('/');
	const routePatterns = Object.values(paths);
	const results = {};
	routePatterns.forEach((pattern) => {
		const splitPattern = pattern.split('/');
		results[pattern] = {
			intersection: intersection(splitPath, splitPattern).length,
			lengthDiffSquared: Math.pow(splitPath.length - splitPattern.length, 2)
		};
	});

	let chosenOne = {
		path: '',
		intersection: 0,
		lengthDiffSquared: 0
	};
	Object.entries(results).forEach(([ pattern, counts ]) => {
		if (counts.intersection > chosenOne.intersection || counts.lengthDiffSquared < chosenOne.lengthDiffSquared) {
			chosenOne = {
				path: pattern,
				...counts
			};
		}
	});

	return chosenOne.path;
};
