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
import SplashScreen from './components/SplashScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

if (process.env.NODE_ENV === 'development') {
	window.store = store;
}

const onBeforeLift = () => {
	// take some action before the gate lifts
	return;
};

const theme = createMuiTheme({
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
	palette: {
		primary: {
			light: '#6d6d6d',
			main: '#424242',
			dark: '#1b1b1b',
			contrastText: '#ffffff',
		},
		secondary: {
			light: '#64c1ff',
			main: '#0091ea',
			dark: '#0064b7',
			contrastText: '#f5f5f5',
		},
		background: {
			paper: '#6d6d6d',
			default: '#424242',
		},
		text: {
			primary: '#ffffff',
			secondary: '#0091ea',
		},
	},
	type: 'dark',
});

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<Paper style={{ minHeight: '100vh', minWidth: '100vw' }} square elevation={0}>
					<PersistGate loading={<SplashScreen />} onBeforeLift={onBeforeLift} persistor={persistor}>
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
				</Paper>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
