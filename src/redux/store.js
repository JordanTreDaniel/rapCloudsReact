import { createStore, applyMiddleware } from 'redux';
import createRootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import sagas from './sagas';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const history = createBrowserHistory();
const persistConfig = {
	key: 'authType',
	storage: storage,
	whitelist: [ 'songs', 'userInfo' ] // which reducer want to store
};
const rootReducer = createRootReducer(history);
const pReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
// const allMiddleWare = [sagaMiddleware];
const store = createStore(pReducer, composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history))));
const persistor = persistStore(store);

sagas.forEach((saga) => sagaMiddleware.run(saga));

export { persistor, store };
