import {
  ADD_SONGS,
  SET_SONG_SEARCH_TERM,
  SEARCH_SONGS,
  FETCH_SONG_DETAILS,
  GEN_SONG_CLOUD,
  FETCH_SONG_LYRICS,
  FETCH_ARTIST_SONGS,
  SET_SONG_LYRICS,
} from "../actionTypes";

const initialState = {
  byId: {},
  searchTerm: "",
  searchLoading: false,
  songDetailLoading: false,
  lyricsLoading: false,
  wordCloudLoading: false,
};

const addSongs = (state, action) => {
  const { songs } = action;
  const songsById = songs.reduce((acc, song) => {
    const existingVersion = state.byId[song.id];
    if (existingVersion) {
      song = { ...existingVersion, ...song };
    }
    acc[song.id] = song;
    return acc;
  }, {});

  return {
    ...state,
    searchLoading: false,
    byId: { ...state.byId, ...songsById },
  };
};

const setSearchTerm = (state, action) => {
  const { searchTerm } = action;
  return { ...state, searchTerm: String(searchTerm) };
};

const addSongDetails = (state, action) => {
  const { song } = action;
  if (!song) return state;
  const { id: songId } = song;
  const songsById = state.byId;
  const oldSong = songsById[songId];
  const mergedSong = { ...oldSong, ...song };
  songsById[songId] = mergedSong;
  return { ...state, byId: { ...songsById }, songDetailLoading: false };
};

const addLyrics = (state, action) => {
  const { songId, lyrics } = action;
  if (!songId || !lyrics) return state;
  const songsById = state.byId;
  const oldSong = songsById[songId];
  const mergedSong = { ...oldSong, lyrics };
  songsById[parseInt(songId)] = mergedSong;
  return { ...state, byId: { ...songsById }, lyricsLoading: false };
};

const loadingMap = {};
Object.values(GEN_SONG_CLOUD).forEach(
  (actionType) => (loadingMap[actionType] = "wordCloudLoading")
);
Object.values(FETCH_SONG_LYRICS).forEach(
  (actionType) => (loadingMap[actionType] = "lyricsLoading")
);
Object.values(FETCH_SONG_DETAILS).forEach(
  (actionType) => (loadingMap[actionType] = "songDetailLoading")
);
Object.values(SEARCH_SONGS).forEach(
  (actionType) => (loadingMap[actionType] = "searchLoading")
);

const setLoading = (state, action) => {
  const { type } = action;
  const val = !!type.match("START");
  const key = loadingMap[type];
  return { ...state, [key]: val };
};

const handlers = {};
Object.values(GEN_SONG_CLOUD).forEach(
  (actionType) => (handlers[actionType] = setLoading)
);
Object.values(FETCH_SONG_LYRICS).forEach(
  (actionType) => (handlers[actionType] = setLoading)
);
Object.values(FETCH_SONG_DETAILS).forEach(
  (actionType) => (handlers[actionType] = setLoading)
);
Object.values(SEARCH_SONGS).forEach(
  (actionType) => (handlers[actionType] = setLoading)
);
handlers[ADD_SONGS] = addSongs;
handlers[FETCH_ARTIST_SONGS.success] = addSongs;
handlers[SET_SONG_SEARCH_TERM] = setSearchTerm;
handlers[FETCH_SONG_DETAILS.success] = addSongDetails;
handlers[FETCH_SONG_LYRICS.success] = addLyrics;
handlers[SET_SONG_LYRICS.success] = addLyrics;

export default (state = initialState, action) => {
  const handle = handlers[action.type];
  if (handle) return handle(state, action);
  return state;
};
