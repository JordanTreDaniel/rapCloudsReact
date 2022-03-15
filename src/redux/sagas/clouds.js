import {
  call,
  select,
  takeLatest,
  put,
  takeEvery,
  cancel,
  all,
} from "redux-saga/effects";
import axios from "axios";
import {
  getCloudSettingsForFlight,
  getUserMongoId,
  getMaskFromId,
  getSongFromId,
  getAccessToken,
  getCloudsAsList,
} from "../selectors";
import {
  FETCH_MASKS,
  ADD_CUSTOM_MASK,
  DELETE_MASK,
  FETCH_CLOUDS,
  DELETE_CLOUDS,
  FETCH_SONG_DETAILS,
  ADD_CLOUDS,
  ADD_CLOUD,
  PRUNE_BAD_CLOUDS,
  FETCH_GOOGLE_FONTS,
} from "../actionTypes";
import { getConnectedSocket } from "../../utils";
const REACT_APP_SERVER_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : "https://rap-clouds-server.herokuapp.com";

const apiGenerateCloud = async (cloud, socketId) => {
  const res = await axios({
    method: "post",
    url: `${REACT_APP_SERVER_ROOT}/triggerCloudGeneration/${socketId}`,
    headers: {
      "Content-Type": "application/json",
      // 'Accept-Encoding': 'gzip',
      // 'Access-Control-Allow-Origin': '*'
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // Accept: 'application/json'
    },
    data: cloud,
  });

  const { status, statusText, data } = res;
  const { cloud: newCloud, message } = data;
  if (status === 200) {
    return { cloud: newCloud, message, status, statusText };
  }

  return { error: { status, statusText } };
};

export function* generateCloud(action) {
  try {
    let { lyricString, cloud } = action;
    if (!lyricString || !lyricString.length)
      return { error: { message: "Must include lyrics to get a cloud" } };
    const cloudSettingsForFlight = yield select(getCloudSettingsForFlight);
    const userId = yield select(getUserMongoId);
    cloud = {
      ...cloud,
      settings: cloudSettingsForFlight,
      lyricString,
      userId,
    };

    const socket = yield call(getConnectedSocket);
    const waitForCloud = () => {
      return new Promise((resolve, reject) => {
        try {
          socket.on("RapCloudFinished", (finishedCloud) => {
            resolve({ finishedCloud });
            socket.close();
          });
          socket.on("RapCloudError", (newCloudError) => {
            reject({ newCloudError });
            socket.close();
          });
        } catch (err) {
          reject({ newCloudError: error });
        }
      });
    };

    const { error } = yield call(apiGenerateCloud, cloud, socket.id);
    // const {cloud, message} = restOfResponse;
    //TO-DO: Do something with the cloud generation confirmation.
    if (error) {
      console.error("Something went wrong in generateCloud", error);
      return { error };
    } else {
      const { finishedCloud, newCloudError } = yield call(waitForCloud);
      if (finishedCloud) {
        return { finishedCloud };
      }
      return { error: newCloudError };
    }
  } catch (err) {
    console.error("Something went wrong", err);
    return { error: err };
  }
}

const apiDeleteClouds = async (cloudIds) => {
  try {
    const res = await axios({
      method: "post",
      url: `${REACT_APP_SERVER_ROOT}/deleteClouds`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        cloudIds,
      },
    });
    const { status, statusText, data } = res;
    const { message } = data;
    if (status === 200) {
      return { message };
    }

    return { error: { status, statusText } };
  } catch (error) {
    console.error("Couldn't delete the clouds", { cloudIds, error });
    return { error };
  }
};

export function* deleteClouds(action) {
  try {
    const { cloudIds } = action;
    if (!cloudIds) {
      yield put({ type: DELETE_CLOUDS.cancellation, cloudIds });
      yield cancel();
    }
    const { error } = yield call(apiDeleteClouds, cloudIds);
    if (error) {
      console.error("Something went wrong in deleteClouds", error);
      return { error };
    } else {
      yield put({ type: DELETE_CLOUDS.success, cloudIds });
      return cloudIds;
    }
  } catch (err) {
    console.error("Something went wrong", err);
    yield put({ type: DELETE_CLOUDS.failure, err });
    return { error: err };
  }
}

const apiFetchMasks = async (userId) => {
  const res = await axios({
    method: "get",
    url: `${REACT_APP_SERVER_ROOT}/masks/${userId}`,
    headers: {
      "Content-Type": "application/json",
      // 'Accept-Encoding': 'gzip',
      // 'Access-Control-Allow-Origin': '*'
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // Accept: 'application/json'
    },
  });
  const { status, statusText, data } = res;
  const { masks } = data;
  if (status === 200) {
    return { masks, status, statusText };
  }

  return { error: { status, statusText } };
};

export function* fetchMasks(action) {
  try {
    const userId = yield select(getUserMongoId);
    const { masks, error } = yield call(apiFetchMasks, userId);
    if (error) {
      console.log("Something went wrong in fetchMasks", error);
      return { error };
    } else {
      yield put({ type: FETCH_MASKS.success, masks });
      return { masks };
    }
  } catch (err) {
    console.log("Something went wrong", err);
    yield put({ type: FETCH_MASKS.failure, err });
    return { error: err };
  }
}

function* watchFetchMasks() {
  yield takeLatest(FETCH_MASKS.start, fetchMasks);
}

const apiAddCustomMask = async (newMask, userId) => {
  const res = await axios({
    method: "post",
    url: `${REACT_APP_SERVER_ROOT}/addMask`,
    headers: {
      "Content-Type": "application/json",
      // 'Accept-Encoding': 'gzip',
      // 'Access-Control-Allow-Origin': '*'
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // Accept: 'application/json'
    },
    data: {
      newMask,
      userId,
    },
  });
  const { status, statusText, data } = res;
  const { mask } = data;
  if (status === 200) {
    return { mask, status, statusText };
  }

  return { error: { status, statusText } };
};

export function* addCustomMask(action) {
  const { newMask } = action;
  const { userId } = newMask || {};
  if (!newMask || !userId) {
    yield put({ type: ADD_CUSTOM_MASK.cancellation });
  }
  try {
    const { mask, error } = yield call(apiAddCustomMask, newMask, userId);
    if (error) {
      console.log("Something went wrong in fetchMasks", error);
      return { error };
    } else {
      yield put({ type: ADD_CUSTOM_MASK.success, mask });
      return { mask };
    }
  } catch (err) {
    console.log("Something went wrong", err);
    yield put({ type: ADD_CUSTOM_MASK.failure, err });
    return { error: err };
  }
}

function* watchAddCustomMask() {
  yield takeEvery(ADD_CUSTOM_MASK.start, addCustomMask);
}

const apiDeleteMask = async ({ maskId, public_id }) => {
  const res = await axios({
    method: "post",
    url: `${REACT_APP_SERVER_ROOT}/deleteMask`,
    headers: {
      "Content-Type": "application/json",
      // 'Accept-Encoding': 'gzip',
      // 'Access-Control-Allow-Origin': '*'
      // 'Access-Control-Allow-Headers': 'Content-Type',
      // Accept: 'application/json'
    },
    data: {
      maskId,
      public_id,
    },
  });
  const { status, statusText, data } = res;
  const { message } = data;
  if (status === 200) {
    return { message };
  }

  return { error: { status, statusText } };
};

export function* deleteMask(action) {
  const { maskId } = action;
  const userId = yield select(getUserMongoId);
  const mask = yield select(getMaskFromId, maskId);
  const { public_id } = mask.info;
  if (!maskId || !userId) {
    yield put({ type: DELETE_MASK.cancellation });
  }
  try {
    const { error } = yield call(apiDeleteMask, { maskId, public_id });
    if (error) {
      console.log("Something went wrong in fetchMasks", error);
      return { error };
    } else {
      yield put({ type: DELETE_MASK.success, maskId });
      yield put({ type: FETCH_MASKS.start });
      return maskId;
    }
  } catch (err) {
    console.log("Something went wrong", err);
    yield put({ type: DELETE_MASK.failure, err });
    return { error: err };
  }
}

function* watchDeleteMask() {
  yield takeEvery(DELETE_MASK.start, deleteMask);
}

const apiFetchClouds = async (userId) => {
  const res = await axios({
    method: "get",
    url: `${REACT_APP_SERVER_ROOT}/getClouds/${userId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { status, statusText, data } = res;
  const { clouds } = data;
  if (status === 200) {
    return { clouds, status, statusText };
  }

  return { error: { status, statusText } };
};

export function* fetchClouds(action) {
  try {
    const userId = yield select(getUserMongoId);
    const { clouds, error } = yield call(apiFetchClouds, userId);
    if (error) {
      console.log("Something went wrong in fetchClouds", error);
      return { error };
    } else {
      const neededSongIds = [];
      for (let cloud of clouds) {
        if (!cloud.info) {
          //TO-DO: Roll the deletions together into one call
          console.log("Got cloud with no info. Deleting", cloud);
          yield put({ type: DELETE_CLOUDS.start, cloudId: cloud.id, cloud });
        }
        for (let songId of cloud.songIds) {
          const matchingSong = yield select(getSongFromId, songId);
          if (!matchingSong && !neededSongIds.includes(songId)) {
            neededSongIds.push(songId);
          }
        }
      }
      yield all(
        neededSongIds.map((songId) =>
          put({
            type: FETCH_SONG_DETAILS.start,
            songId,
            generateCloud: false,
            fetchClouds: false,
          })
        )
      );
      //TO-DO: Should I also fetch associated artists?
      yield put({ type: FETCH_CLOUDS.success, clouds });
      return { clouds };
    }
  } catch (err) {
    console.log("Something went wrong", err);
    yield put({ type: FETCH_CLOUDS.failure, err });
    return { error: err };
  }
}

export function* pruneBadClouds() {
  try {
    const cloudsList = yield select(getCloudsAsList);
    const cloudsToDelete = [];
    cloudsList.forEach((cloud) => {
      const { info, createdAt: _createdAt, id } = cloud;
      if (!_createdAt) {
        cloudsToDelete.push(id);
        return;
      }
      const createdAt = new Date(_createdAt);
      if (info) return;
      const thirtyMinAfterCreation = new Date(
        createdAt.getTime() + 30 * 60 * 1000
      );
      const difference = createdAt.getTime() - thirtyMinAfterCreation.getTime();
      const isOlderThanThirtyMin = difference < 0;
      console.log({
        createdAt: createdAt.toUTCString(),
        thirtyMinAfterCreation: thirtyMinAfterCreation.toUTCString(),
        isOlderThanThirtyMin,
      });
      console.log({ cloudsToDelete });
      if (isOlderThanThirtyMin && !info) {
        //delete cloudinary resource?
        cloudsToDelete.push(id);
      }
    });
    if (cloudsToDelete.length) {
      yield put({ type: DELETE_CLOUDS.start, cloudIds: cloudsToDelete });
    }
  } catch (err) {}
}

const apiFetchGoogleFonts = async () => {
  try {
    const res = await axios({
      method: "get",
      url: `${REACT_APP_SERVER_ROOT}/getGoogleFonts`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { status, statusText, data } = res;
    if (status === 200) {
      return data
    }
    return { error: { status, statusText } };
  } catch (error) {
    console.error("Couldn't delete the clouds", {  error });
    return { error };
  }
}

export function* fetchGoogleFonts() {
  try {
    const {fonts} = yield call(apiFetchGoogleFonts)
    yield put({type: FETCH_GOOGLE_FONTS.success, fonts})
  } catch (error) {
    yield put({type: FETCH_GOOGLE_FONTS.failure, error})
    console.error("Something went wrong during fetchGoogleFonts", error);

  }
}

const apiFetchSongClouds = async (songId, accessToken, userId) => {
  if (!songId || !accessToken || !userId) {
    console.error(
      `Could not fetch song clouds without access token, user id, & song id`,
      { songId, accessToken }
    );
    return {
      error: `Could not fetch song clouds without access token, user id, & song id`,
    };
  }
  const res = await axios({
    method: "get",
    url: `${REACT_APP_SERVER_ROOT}/getSongClouds/${songId}/${userId}`,
  });
  const { status, statusText, data } = res;
  const { officialCloud, userMadeClouds } = data;
  if (status === 200) {
    return { officialCloud, userMadeClouds };
  }

  return { error: { status, statusText } };
};

export function* fetchSongClouds(action) {
  try {
    const accessToken = yield select(getAccessToken);
    const userId = yield select(getUserMongoId);
    const { songId } = action;
    const {
      officialCloud,
      userMadeClouds,
      error: cloudsError,
    } = yield call(apiFetchSongClouds, songId, accessToken, userId);

    if (cloudsError) {
      yield put({ type: FETCH_SONG_DETAILS.failure });
      console.error("Something went wrong in fetchSongClouds", cloudsError);
      return { error: cloudsError };
    } else {
      //TO-DO: Handle possible cloudsError
      if (userMadeClouds && userMadeClouds.length) {
        yield put({ type: ADD_CLOUDS, clouds: userMadeClouds });
      }
      if (officialCloud) {
        yield put({ type: ADD_CLOUD, finishedCloud: officialCloud });
      }
      return { officialCloud, userMadeClouds };
    }
  } catch (error) {
    console.log("Something went wrong in fetchSongClouds", error);
    yield cancel();
  }
}

function* watchFetchClouds() {
  yield takeLatest(FETCH_CLOUDS.start, fetchClouds);
}

function* watchdeleteClouds() {
  yield takeEvery(DELETE_CLOUDS.start, deleteClouds);
}
function* watchPruneClouds() {
  yield takeEvery(PRUNE_BAD_CLOUDS.start, pruneBadClouds);
}
function* watchFetchFonts() {
  yield takeEvery(FETCH_GOOGLE_FONTS.start, fetchGoogleFonts);
}

export default [
  watchFetchMasks,
  watchAddCustomMask,
  watchDeleteMask,
  watchFetchClouds,
  watchdeleteClouds,
  watchPruneClouds,
  watchFetchFonts
];
