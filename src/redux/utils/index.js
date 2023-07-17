import _normalizeLyrics from "./normalizeLyrics";
import paths from "../../paths";
import { matchPath } from "react-router-dom";

export const normalizeLyrics = _normalizeLyrics;

export const replaceDiacritics = (str) => {
  // NOTE: GREAT explanation of how this works here:
  // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
  const normedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normedStr;
};
// deriveMatchFromPath - Takes the current location path, and matches it to a route pattern
// NOTE - I'm positive this algorithm could be improved
export const deriveMatchFromPath = (path) => {
  const routePatterns = Object.values(paths);
  let validMatch;
  for (const routePattern of routePatterns) {
    const match = matchPath(
      { path: routePattern, exact: true, strict: true },
      path
    );
    if (match) {
      validMatch = match;
      break;
    }
  }
  return validMatch;
};
