import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import SignIn from './components/SignIn';
import SongDetail from './components/SongDetail';
import Search from './components/Search';
import Navbar from './components/Navbar';
import ArtistPage from './components/ArtistPage';
import { setUser } from './redux/actions';
import { Redirect } from 'react-router-dom';
import * as selectors from './redux/selectors';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
});

const App = (props) => {
	const { user, appIsHydrated, location } = props;
	if (!user && appIsHydrated && location.pathname !== '/signin') {
		console.log('APP rendered w/ no user after hydration, redirecting.');
		return <Redirect to="/signin" />;
	}
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/signin" render={(routerProps) => <SignIn history={routerProps.history} />} />
					<Route path="/search" render={(routerProps) => <Search history={routerProps.history} />} />
					<Route
						path="/clouds/:songId"
						render={(routerProps) => <SongDetail history={routerProps.history} />}
					/>
					<Route
						path="/cloudMakers/:artistId"
						render={(routerProps) => <ArtistPage history={routerProps.history} />}
					/>
					<Route render={() => <Redirect to="/search" />} />
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
