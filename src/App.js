import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/SignIn';
import SongDetail from './components/SongDetail';
import LoadingCloud from './components/LoadingCloud';
import Search from './connected/Search';
import Navbar from './connected/Navbar';
import ArtistPage from './connected/ArtistPage';
import { setUser } from './redux/actions';
import { Redirect } from 'react-router-dom';
import * as selectors from './redux/selectors';
import { connect } from 'react-redux';
import { Paper } from '@material-ui/core';
import paths from './paths.js';
import ReactGA from 'react-ga';
import { history } from './redux/store';
import SplashScreen from './components/SplashScreen';

function initializeReactGA() {
	console.log('Initializing analytics');
	ReactGA.initialize('UA-166594032-2');
	ReactGA.pageview('/home');
	history.listen((location) => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	});
}

const App = (props) => {
	const { user, appIsHydrated, location } = props;
	useEffect(() => {
		initializeReactGA();
	}, []);
	if (!user && appIsHydrated && location.pathname !== paths.signIn) {
		console.log('APP rendered w/ no user after hydration, redirecting.');
		return <Redirect to={paths.signIn} />;
	}
	return appIsHydrated ? (
		<Paper style={{ minHeight: '100vh', minWidth: '100vw' }}>
			<Navbar />
			<Paper style={{ minHeight: '91vh', minWidth: '100vw', overflow: 'hidden' }}>
				<Switch>
					<Route path={paths.signIn} render={(routerProps) => <SignIn history={routerProps.history} />} />
					<Route path={paths.search} render={(routerProps) => <Search history={routerProps.history} />} />
					<Route
						path={paths.songPage}
						render={(routerProps) => <SongDetail history={routerProps.history} />}
					/>
					<Route
						path={paths.artistPage}
						render={({ history }) => {
							return <ArtistPage history={history} />;
						}}
					/>
					{process.env.NODE_ENV === 'development' ? (
						<React.Fragment>
							<Route path={'/loadingCloud'} render={(routerProps) => <LoadingCloud />} />
							<Route path={'/splash'} render={(routerProps) => <SplashScreen />} />
						</React.Fragment>
					) : null}
					<Route render={() => <Redirect to={paths.search} />} />
				</Switch>
			</Paper>
			<Paper
				style={{
					height: '33vh',
					width: '100vw',
					overflow: 'visible',
					backgroundColor: '#64c1ff',
					display: 'block',
				}}
			>
				<h1>Footer</h1>
			</Paper>
		</Paper>
	) : (
		<h1>Rap Clouds</h1>
	);
};

const mapState = (state) => ({
	user: selectors.getUser(state),
	appIsHydrated: selectors.isAppRehydrated(state),
});

export default connect(mapState, { setUser })(App);
