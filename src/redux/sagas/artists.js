import { put, takeEvery, call, select, cancel, all } from "redux-saga/effects";
import {
  FETCH_ARTIST,
  SIGN_OUT,
  FETCH_SONG_LYRICS,
  GEN_ARTIST_CLOUD,
  FETCH_ARTIST_SONGS,
  FETCH_ARTIST_GAME,
  MODIFY_ARTIST,
} from "../actionTypes";
import {
  getAccessToken,
  getArtistFromId,
  getCloudsForArtist,
  getArtistsSongs,
  getArtistGame,
} from "../selectors";
import { fetchSongLyrics, fetchSongEverything } from "./songs";
import { generateCloud } from "./clouds";
import axios from "axios";
import normalizeLyrics from "../utils/normalizeLyrics";

const REACT_APP_SERVER_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : "https://rap-clouds-server.herokuapp.com";

const apiFetchArtist = async (artistId, accessToken) => {
  const res = await axios({
    method: "get",
    url: `${REACT_APP_SERVER_ROOT}/getArtistDetails/${artistId}`,
    headers: {
      Authorization: accessToken,
    },
  });
  const { status, statusText, data } = res;
  const { artist } = data;
  if (status === 200) {
    return { artist };
  }

  return { error: { status, statusText } };
};

const apiFetchArtistSongs = async (artistId, page = 1, accessToken) => {
  const res = await axios({
    method: "get",
    url: `${REACT_APP_SERVER_ROOT}/getArtistSongs/${artistId}/${page}`,
    headers: {
      Authorization: accessToken,
    },
  });
  const { status, statusText, data } = res;
  const { songs, nextPage } = data;
  if (status === 200) {
    return { songs, nextPage };
  }

  return { error: { status, statusText } };
};

export function* fetchArtist(action) {
  const { fetchSongsToo = true, artistId, forceFetch = false } = action;
  const accessToken = yield select(getAccessToken);
  if (!accessToken) {
    console.error(`Could not fetch artist without access token `, {
      accessToken,
    });
    yield put({ type: SIGN_OUT });
    yield cancel();
  }
  if (!artistId) {
    console.error(`Could not fetch artist without artist id`, { artistId });
    yield put({ type: FETCH_ARTIST.failure, artistId });
    yield cancel();
  }
  const exisitingInStore = yield select(getArtistFromId, artistId);
  if (exisitingInStore && !forceFetch) {
    //TO-DO: This efficiency check doesn't work around rehydration time
    yield put({ type: FETCH_ARTIST.cancellation });
    yield cancel();
    return;
  }

  const { artist, error } = yield call(apiFetchArtist, artistId, accessToken);
  if (error) {
    yield put({ type: FETCH_ARTIST.failure, artistId, error });
    return error;
  } else {
    yield put({ type: FETCH_ARTIST.success, artist });
    if (fetchSongsToo)
      yield put({ type: FETCH_ARTIST_SONGS, artistId, fetchCloudToo: true });
    return { artist };
  }
}

export function* fetchArtistSongs(action) {
  const { artistId, fetchCloudToo = false, level } = action;
  const accessToken = yield select(getAccessToken);
  if (!accessToken) {
    console.error(`Could not fetch artist without access token `, {
      accessToken,
    });
    yield put({ type: SIGN_OUT });
    yield cancel();
  }
  if (!artistId) {
    console.error(`Could not fetch artist without artist id`, { artistId });
    yield put({ type: FETCH_ARTIST_SONGS.failure, artistId });
    yield cancel();
  }
  const artist = yield select(getArtistFromId, artistId) || {};
  //NOTE: Both level & nextPage exist to maintain indices for game levels & actual pages, which are both based on pages.
  const { nextPage: page } = artist;
  if (!level && page === null) {
    yield put({
      type: FETCH_ARTIST_SONGS.cancellation,
      artistId,
      reason: "Next page doesn't exist.",
    });
  }
  const {
    songs = [],
    nextPage = null,
    error,
  } = yield call(apiFetchArtistSongs, artistId, level || page, accessToken);
  if (error) {
    yield put({ type: FETCH_ARTIST_SONGS.failure, artistId });
  } else {
    if (!level)
      yield put({
        type: MODIFY_ARTIST,
        artist: { nextPage: nextPage, id: artistId },
      });
    if (songs.length) yield put({ type: FETCH_ARTIST_SONGS.success, songs });
    if (fetchCloudToo) {
      yield put({
        type: GEN_ARTIST_CLOUD.start,
        songs: songs.map((song) => ({ id: song.id, path: song.path })),
        artistId,
      });
    }
    return { songs, nextPage: nextPage, nextLevel: nextPage };
  }
}

export function* genArtistCloud(action) {
  try {
    const { artistId, forceFetch = false } = action;
    let { cloud = {} } = action;
    const artist = yield select(getArtistFromId, artistId);
    const cloudsForArtist = yield select(getCloudsForArtist, artistId);
    const songs = yield select(getArtistsSongs, artistId);
    if (artist && cloudsForArtist.length && !forceFetch) {
      yield put({ type: GEN_ARTIST_CLOUD.cancellation });
      yield cancel();
      return;
    }
    const songIds = [],
      artistIds = [artistId];
    const allLyrics = yield all(
      songs.map((song) => {
        const { id: songId, path: songPath } = song;
        songIds.push(songId);
        //TO-DO: Add artistIds from each artist of the song.artists
        // artistIds.push(artistId);
        return fetchSongLyrics({
          type: FETCH_SONG_LYRICS.start,
          songId,
          songPath,
          generateCloud: false,
        });
      })
    );
    const normalizedLyricsJumble = allLyrics.reduce(
      (acc, songLyrics) => acc + " " + normalizeLyrics(songLyrics),
      ""
    );
    cloud = {
      ...cloud,
      artistIds,
      songIds,
      lyricString: normalizedLyricsJumble,
      inspirationType: "artist",
    };
    const { finishedCloud, error } = yield call(generateCloud, {
      lyricString: normalizedLyricsJumble,
      cloud,
    });
    if (error) {
      yield put({ type: GEN_ARTIST_CLOUD.failure });
      console.log("Something went wrong in fetch artist cloud", error);
    } else {
      yield put({ type: GEN_ARTIST_CLOUD.success, finishedCloud });
      return finishedCloud;
    }
  } catch (err) {
    yield put({ type: GEN_ARTIST_CLOUD.failure });
    console.log("Something went wrong in fetch artist cloud", err);
  }
}

//TO-DO: Move this to games sagas when created.
export function* fetchArtistGame(action) {
  try {
    const { artistId, fetchArtistToo = false, level = 1 } = action;
    const game = yield select(getArtistGame);
    if (game) {
      const { questions } = game;
      const gameOver =
        questions.filter((q) => q.answerIdx === 0 || q.answerIdx).length ===
        questions.length;
      if (gameOver) {
        yield put({
          type: FETCH_ARTIST_GAME.cancellation,
          artistId,
          fetchArtistToo,
          level,
        });
        yield cancel();
      }
    }
    if (fetchArtistToo) {
      yield put({ type: FETCH_ARTIST.start, artistId });
    }
    const { songs, nextLevel, error } = yield call(fetchArtistSongs, {
      artistId,
      level,
    });
    const genAnswers = (song) => {
      const { full_title, id: songId } = song;
      let answers = [{ title: full_title, correct: true, songId: song.id }],
        visited = [];
      do {
        let randomIdx = Math.floor(Math.random() * (songs.length - 1));
        while (visited.includes(randomIdx)) {
          randomIdx = Math.floor(Math.random() * (songs.length - 1));
        }
        visited.push(randomIdx);
        const song = songs[randomIdx];
        if (song.id === songId) continue;
        answers.splice(Math.floor(Math.random() * 3), 0, {
          title: song.full_title,
          songId: song.id,
          correct: song.full_title === full_title,
        });
      } while (answers.length < 4);
      return answers;
    };

    if (error) {
      yield put({ type: FETCH_ARTIST_GAME.failure });
      console.log("Something went wrong in fetch artist cloud", error);
    } else {
      //how can i generate
      //put a bunch of requests to get the songs here
      //const dummySongs = yield select get songs for artist
      const game = {
        level,
        nextLevel,
        artistId,
        questions: songs.map((song) => ({
          songId: song.id,
          answers: genAnswers(song),
        })),
      };
      yield put({ type: FETCH_ARTIST_GAME.success, game });
      for (let songIdx in songs) {
        if (songIdx === 0) continue;
        const song = songs[songIdx];
        yield call(fetchSongEverything, { songId: song.id });
      }
      return game;
    }
  } catch (err) {
    yield put({ type: FETCH_ARTIST_GAME.failure });
    console.log("Something went wrong in fetch artist cloud", err);
  }
}

function* watchFetchArtist() {
  yield takeEvery(FETCH_ARTIST.start, fetchArtist);
}

function* watchFetchArtistSongs() {
  yield takeEvery(FETCH_ARTIST_SONGS.start, fetchArtistSongs);
}

function* watchGenArtistCloud() {
  yield takeEvery(GEN_ARTIST_CLOUD.start, genArtistCloud);
}

function* watchGenArtistGame() {
  yield takeEvery(FETCH_ARTIST_GAME.start, fetchArtistGame);
}

export default [
  watchFetchArtist,
  watchGenArtistCloud,
  watchFetchArtistSongs,
  watchGenArtistGame,
];
