import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'authType',
  storage: storage,
  whitelist: ["songs", "userInfo"] // which reducer want to store
};
const pReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
// const allMiddleWare = [sagaMiddleware];
const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
const persistor = persistStore(store);

sagas.forEach(saga => sagaMiddleware.run(saga));

export { persistor, store };
