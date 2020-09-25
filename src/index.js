import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/es/integration/react';
import { history } from './redux/store';
import LoadingCloud from './components/LoadingCloud';
import ErrorBoundary from './components/ErrorBoundary';
if (process.env.NODE_ENV === 'development') {
	window.store = store;
}

const onBeforeLift = () => {
	// take some action before the gate lifts
	return;
};

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate
				loading={
					<div style={{ height: '100vh', width: '100vh', paddingTop: '40%' }}>
						<div style={{ margin: 'auto' }}>
							<LoadingCloud />
						</div>
					</div>
				}
				onBeforeLift={onBeforeLift}
				persistor={persistor}
			>
				<ConnectedRouter history={history}>
					<Switch>
						<Route
							path="/"
							render={(routerProps) => (
								<ErrorBoundary>
									<App {...routerProps} />
								</ErrorBoundary>
							)}
						/>
					</Switch>
				</ConnectedRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
