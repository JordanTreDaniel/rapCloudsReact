import React from 'react';
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
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import paths from './paths.js';

const theme = createMuiTheme({
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
});

const App = (props) => {
	const { user, appIsHydrated, location } = props;
	if (!user && appIsHydrated && location.pathname !== paths.signIn) {
		console.log('APP rendered w/ no user after hydration, redirecting.');
		return <Redirect to={paths.signIn} />;
	}
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Navbar />
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
					<Route render={() => <Redirect to={paths.search} />} />
				</Switch>
			</div>
		</ThemeProvider>
	);
};

const mapState = (state) => ({
	user: selectors.getUser(state),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, { setUser })(App);
