import React from 'react';
import { Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import './App.css';
import SignIn from './components/SignIn';
import Search from './components/Search';
import RapCloud from './components/RapCloud';
import { setUser } from './redux/actions';
import { connect } from 'react-redux';
class App extends React.Component {
	componentDidMount = () => {
		const user = localStorage.getItem('rapCloudsUser');
		if (user) {
			this.props.setUser(JSON.parse(user));
			// this.props.history.push('/search')
		}
	};
	render = () => {
		return (
			<div className="App">
				<Typography variant="h1">Rap Clouds</Typography>
				<Route path="/signin" render={(routerProps) => <SignIn history={routerProps.history} />} />
				<Route path="/search" render={(routerProps) => <Search history={routerProps.history} />} />
				<Route path="/clouds/:songId" render={(routerProps) => <RapCloud history={routerProps.history} />} />
			</div>
		);
	};
}

export default connect(null, { setUser })(App);
