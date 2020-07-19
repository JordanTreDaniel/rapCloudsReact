import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './redux/store';
if (process.env.NODE_ENV === 'development') {
	window.store = store;
}
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Switch>
					<Route path="/" render={(routerProps) => <App {...routerProps} />} />
				</Switch>
			</ConnectedRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
