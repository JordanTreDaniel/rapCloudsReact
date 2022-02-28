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
  getCloudFromId,
  getMaskFromId,
  getSongFromId,
  getAccessToken,
} from "../selectors";
import {
  FETCH_MASKS,
  ADD_CUSTOM_MASK,
  DELETE_MASK,
  FETCH_CLOUDS,
  DELETE_CLOUD,
  FETCH_SONG_DETAILS,
  ADD_CLOUDS,
  ADD_CLOUD,
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

const apiDeleteCloud = async (cloudId, public_id) => {
  try {
    const res = await axios({
      method: "post",
      url: `${REACT_APP_SERVER_ROOT}/deleteCloud`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        cloudId,
        public_id,
      },
    });
    const { status, statusText, data } = res;
    const { message } = data;
    if (status === 200) {
      return { message };
    }

    return { error: { status, statusText } };
  } catch (error) {
    console.error("Couldn't delete the cloud", { cloudId, error });
    return { error };
  }
};

export function* deleteCloud(action) {
  try {
    const { cloudId } = action;
    let { cloud } = action;
    if (!cloudId) {
      yield put({ type: DELETE_CLOUD.cancellation, cloudId });
      yield cancel();
    }
    cloud = cloud ? cloud : yield select(getCloudFromId, cloudId);
    const { public_id } = cloud.info || {};
    const { error } = yield call(apiDeleteCloud, cloudId, public_id);
    if (error) {
      console.log("Something went wrong in deleteCloud", error);
      return { error };
    } else {
      yield put({ type: DELETE_CLOUD.success, cloudId });
      return cloudId;
    }
  } catch (err) {
    console.log("Something went wrong", err);
    yield put({ type: DELETE_CLOUD.failure, err });
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
          yield put({ type: DELETE_CLOUD.start, cloudId: cloud.id, cloud });
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

function* watchDeleteCloud() {
  yield takeEvery(DELETE_CLOUD.start, deleteCloud);
}

export default [
  watchFetchMasks,
  watchAddCustomMask,
  watchDeleteMask,
  watchFetchClouds,
  watchDeleteCloud,
];
