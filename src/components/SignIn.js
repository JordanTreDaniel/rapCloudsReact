import React, { useState } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { makeStyles, Button, Paper } from '@material-ui/core';
// import "./SignIn.css"; //Don't think we need this
import { setUser, addSongs } from '../redux/actions';
import { classNames } from '../utils';
import paths from '../paths';
const API_URL =
	process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'https://rap-clouds-server.herokuapp.com';
const socket = io(API_URL);

const useStyles = makeStyles((theme) => {
	return {
		signInWrapper: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
		},
	};
});

const SignIn = (props) => {
	let popup = null;
	const [ popUpOpen, togglePopUp ] = useState(false);
	const classes = useStyles();
	// Routinely checks the popup to re-enable the login button
	// if the user closes the popup without authenticating.
	const checkPopup = () => {
		const check = setInterval(() => {
			if (!popup || popup.closed || popup.closed === undefined) {
				clearInterval(check);
				togglePopUp(false);
			}
		}, 1000);
	};

	// Launches the popup on the server and passes along the socket id so it
	// can be used to send back user data to the appropriate socket on
	// the connected client.
	const openPopup = () => {
		const width = 600,
			height = 600;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;

		const url = `${API_URL}/authorize/genius?socketId=${socket.id}`;

		return window.open(
			url,
			'',
			`toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`,
		);
	};

	// Kicks off the processes of opening the popup on the server and listening
	// to the popup. It also disables the login button so the user can not
	// attempt to login to the provider twice.
	const startAuth = () => {
		if (!popUpOpen) {
			socket.on('genius', (user) => {
				popup.close();
				props.setUser(user);
				props.history.push(paths.search);
			});
			togglePopUp(true);
			popup = openPopup();
			checkPopup();
		}
	};

	return (
		<Paper className={classNames(classes.signInWrapper)}>
			<div className={'button'}>
				<Button onClick={startAuth} className={`twitter ${popUpOpen && 'disabled'}`}>
					Sign In
				</Button>
			</div>
		</Paper>
	);
};

export default connect(null, { setUser, addSongs })(SignIn);
