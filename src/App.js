import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/SignIn';
import SongDetail from './components/SongDetail';
import Search from './connected/Search';
import Navbar from './connected/Navbar';
import ArtistPage from './connected/ArtistPage';
import { setUser } from './redux/actions';
import { Redirect } from 'react-router-dom';
import * as selectors from './redux/selectors';
import { connect } from 'react-redux';
import { Paper, makeStyles } from '@material-ui/core';
import paths from './paths.js';
import ReactGA from 'react-ga';
import { history } from './redux/store';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import { classNames } from './utils';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
function initializeReactGA() {
	console.log('Initializing analytics');
	ReactGA.initialize('UA-166594032-2');
	// ReactGA.pageview('/home');
	history.listen((location) => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	});
}

const useStyles = makeStyles((theme) => {
	return {
		appContainer: {
			minHeight: '100vh',
			minWidth: '100vw',
			backgroundColor: theme.palette.primary.dark,
		},
		pagesContainer: {
			minHeight: '91vh',
			minWidth: '100vw',
			overflow: 'hidden',
			backgroundColor: theme.palette.primary.dark,
		},
		square: {
			borderRadius: 0,
		},
	};
});
const App = (props) => {
	const { user, appIsHydrated, location } = props;
	const classes = useStyles();
	useEffect(() => {
		initializeReactGA();
	}, []);
	if (!user && appIsHydrated && ![ paths.signIn, paths.about, paths.root ].includes(location.pathname)) {
		console.log('APP rendered w/ no user after hydration, redirecting.');
		return <Redirect to={paths.signIn} />;
	}
	return appIsHydrated ? (
		<Paper className={classNames(classes.appContainer, classes.square)} elevation={0}>
			<Navbar />
			<Paper className={classNames(classes.pagesContainer, classes.square)} elevation={0}>
				<Switch>
					<Route path={paths.about} exact render={() => <LandingPage user={user} />} />
					<Route
						path={paths.signIn}
						exact
						render={(routerProps) => <SignIn history={routerProps.history} />}
					/>
					<Route
						path={paths.search}
						exact
						render={(routerProps) => <Search history={routerProps.history} />}
					/>
					<Route
						path={paths.songPage}
						exact
						render={(routerProps) => <SongDetail history={routerProps.history} />}
					/>
					<Route
						path={paths.artistPage}
						exact
						render={({ history }) => {
							return <ArtistPage history={history} />;
						}}
					/>

					{/* <Route path={'/splash'} exact render={(routerProps) => <SplashScreen />} /> */}
					<Route render={() => <Redirect to={user ? paths.search : paths.about} />} />
				</Switch>
			</Paper>
			<Footer />
			<Paper
				id="copyright"
				className={classes.square}
				elevation={0}
				style={{
					height: '2em',
					width: '100vw',
					overflow: 'hidden',
					backgroundColor: '#424242',
					color: '#ffffff',
					display: 'block',
					textAlign: 'center',
					paddingTop: '.5em',
					paddingBottom: '.5em',
				}}
			>
				@RapClouds 2020
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
