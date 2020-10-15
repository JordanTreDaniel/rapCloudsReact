import React, { useState } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { makeStyles, Button, Grid, IconButton, Typography } from '@material-ui/core';
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
			minHeight: '91vh',
		},
		fullSection: {
			height: '100vh',
		},
		firstFullSection: {
			height: '91vh',
		},
		primaryDarkBacking: {
			backgroundColor: theme.palette.primary.dark,
		},
		primaryMainBacking: {
			backgroundColor: theme.palette.primary.main,
		},
		primaryLightBacking: {
			backgroundColor: theme.palette.primary.light,
		},
		secondaryMainBacking: {
			backgroundColor: theme.palette.secondary.main,
		},
		step: {
			color: theme.palette.secondary.contrastText,
			fontWeight: theme.typography.fontWeightBold,
			position: 'relative',
		},
		stepNumber: {
			width: '2.4em',
			height: '2.4em',
			margin: '.5em',
			color: theme.palette.secondary.contrastText,
			fontWeight: theme.typography.fontWeightBold,
			opacity: '.8',
			position: 'absolute',
			top: '.3em',
		},
		stepExplanation: {
			textAlign: 'center',
			padding: '.5em',
		},
	};
});

const SignIn = (props) => {
	let popup = null;
	const [ popUpOpen, togglePopUp ] = useState(false);
	const classes = useStyles();
	console.log('classes', classes);
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
		<Grid className={classNames(classes.signInWrapper)} container>
			<Grid item container xs={12} className={classNames(classes.fullSection, classes.firstFullSection)}>
				<Grid
					item
					container
					xs={12}
					className={classNames(classes.step, classes.primaryDarkBacking)}
					alignContent="stretch"
					alignItems="center"
					justify="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(classes.stepNumber, classes.secondaryMainBacking)}
						>
							1
						</IconButton>
					</Grid>

					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">Go to Genius</Typography>
						<Typography variant="body2">(1.5 sec) </Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					className={classNames(classes.step, classes.primaryLightBacking)}
					alignContent="stretch"
					alignItems="center"
					justify="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(classes.stepNumber, classes.primaryMainBacking)}
						>
							2
						</IconButton>
					</Grid>

					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">Sign in with Facebook, Google, Twitter, Email</Typography>
						<Typography variant="body2">(2.4 sec) </Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					className={classNames(classes.step, classes.secondaryMainBacking)}
					alignContent="stretch"
					alignItems="center"
					justify="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(classes.stepNumber, classes.primaryDarkBacking)}
						>
							3
						</IconButton>
					</Grid>
					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">Authorize us to use your Genius account</Typography>
						<Typography variant="body2">(1.2 sec) </Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					className={classNames(classes.step, classes.primaryDarkBacking)}
					alignContent="stretch"
					alignItems="center"
					justify="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(classes.stepNumber, classes.secondaryMainBacking)}
						>
							4
						</IconButton>
					</Grid>

					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">Enjoy making Rap Clouds!</Typography>
						<Typography variant="body2">(forever) </Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} className={classNames(classes.fullSection)} />
			<div className={'button'}>
				<Button onClick={startAuth} className={`twitter ${popUpOpen && 'disabled'}`}>
					Sign In
				</Button>
			</div>
		</Grid>
	);
};

export default connect(null, { setUser, addSongs })(SignIn);
