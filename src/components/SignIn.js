import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Grid, IconButton, Typography, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowIcon from "@mui/icons-material/ArrowForward";
// import "./SignIn.css"; //Don't think we need this
import { setUser, addSongs, updateUser, fetchClouds } from "../redux/actions";
import * as selectors from "../redux/selectors";
import { classNames, getConnectedSocket } from "../utils";
import paths from "../paths";
import { Redirect } from "react-router-dom";
const API_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3333"
		: "https://rap-clouds-server.herokuapp.com";

const useStyles = makeStyles((theme) => {
	return {
		signInWrapper: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
			minHeight: "91vh",
		},
		fullSection: {
			minHeight: "100vh",
		},
		halfSection: {
			height: "50vh",
		},
		whiteLetters: {
			color: theme.palette.secondary.contrastText,
		},
		stepsSection: {},
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
			fontWeight: theme.typography.fontWeightBold,
			position: "relative",
		},
		stepNumber: {
			width: "2.4em",
			height: "2.4em",
			margin: ".5em",
			fontWeight: theme.typography.fontWeightBold,
		},
		floater: {
			opacity: ".8",
			position: "absolute",
			top: ".3em",
		},
		stepExplanation: {
			textAlign: "center",
			padding: ".5em",
		},
		signInSignUpSection: {
			minHeight: "91vh",
		},
		pleaseSignInMsg: {},
		partnerShipAvatars: { margin: "1.5em" },
		partnerAvatar: {
			width: "9em",
			height: "9em",
			border: `3px solid ${theme.palette.secondary.main}`,
		},
		rapCloudsAvatar: {
			marginLeft: "-1em",
			zIndex: "2",
		},
		geniusAvatar: {
			marginRight: "-1em",
		},
		signInBtn: {
			marginBottom: "1em",
			marginTop: "1em",
			fontSize: "1.5em",
			fontWeight: theme.typography.fontWeightBold,
		},
		signUpExplanation: {
			// maxHeight: '25vh',
		},
	};
});

const SignIn = (props) => {
	const [socket, setSocket] = useState(null);
	const classes = useStyles();
	const { userId } = props;
	// Kicks off the processes of opening the popup on the server and listening
	// to the popup. It also disables the login button so the user can not
	// attempt to login to the provider twice.
	const openSocket = async () => {
		const _socket = await getConnectedSocket();
		_socket.on("genius", async (user) => {
			console.info("You're a genius!", user);
			props.setUser(user);
			props.fetchClouds();
			_socket.close();
			setSocket(null);
			props.history.push(paths.about);
		});
		setSocket(_socket);
	};
	const closeSocket = async () => {
		console.log("Attempting to close the socket now");
		if (socket) {
			socket.close();
		}
	};
	const getSocketURL = () => {
		const url = socket
			? `${API_URL}/authorize/genius?socketId=${socket.id}`
			: null;
		return url;
	};
	console.log(getSocketURL());

	useEffect(() => {
		openSocket();
	}, []);
	useEffect(
		() => () => {
			console.log("closing socket");
			closeSocket();
		},
		[]
	);
	if (userId) return <Redirect to={paths.about} />;

	return (
		<Grid className={classNames(classes.signInWrapper)} container>
			<Grid
				id="signInSignUpSection"
				item
				xs={12}
				container
				className={classNames(
					classes.fullSection,
					classes.primaryLightBacking,
					classes.signInSignUpSection
				)}
				wrap="nowrap"
				justifyContent="space-evenly"
				alignContent="center"
				alignItems="center"
				direction="column"
			>
				<Grid
					id="pleaseSignInMsg"
					item
					container
					justifyContent="center"
					alignContent="center"
					alignItems="center"
					direction="column"
					wrap="wrap"
				>
					<Typography
						className={classNames(classes.pleaseSignInMsg)}
						color="primary"
						alignItems="center"
						variant="h4"
					>
						Welcome to Rap Clouds!
					</Typography>
					<Typography
						className={classNames(classes.pleaseSignInMsg)}
						color="primary"
						alignItems="center"
						variant="h4"
					>
						Please Sign In
					</Typography>
					<Typography
						className={classNames(classes.pleaseSignInMsg)}
						component={"a"}
						href={"#stepsSection"}
						alignItems="center"
						color="primary"
						variant="body2"
					>
						(for free, in only 5 seconds!)
					</Typography>
				</Grid>
				<Grid
					id="partnerShipAvatars"
					component="a"
					href={getSocketURL()}
					disabled={!!!getSocketURL()}
					target="_blank"
					className={classNames(classes.partnerShipAvatars)}
					item
					container
					justifyContent="center"
					alignContent="center"
					alignItems="center"
					direction="row"
					wrap="wrap"
				>
					<Avatar
						item="true"
						alt="Genius Logo"
						xs={6}
						src={`${process.env.PUBLIC_URL}/geniusLogo.jpg`}
						className={classNames(
							classes.primaryMainBacking,
							classes.partnerAvatar,
							classes.geniusAvatar
						)}
					/>
					<Avatar
						item="true"
						alt="RapClouds Logo"
						xs={6}
						src={`${process.env.PUBLIC_URL}/rapClouds.png`}
						className={classNames(
							classes.primaryMainBacking,
							classes.partnerAvatar,
							classes.rapCloudsAvatar
						)}
					/>
				</Grid>
				<Grid item component="a" href={getSocketURL()} target="_blank">
					<Button
						className={`twitter ${classes.secondaryMainBacking} ${classes.whiteLetters} ${classes.signInBtn}`}
						disabled={!!!getSocketURL()}
					>
						Sign In / Sign Up
					</Button>
				</Grid>
				<Grid
					item
					container
					xs={6}
					className={classNames(classes.signUpExplanation)}
					direction="column"
					justifyContent="center"
					alignContent="center"
					alignItems="center"
				>
					<Typography alignItems="center" variant="h5">
						Why do I have to sign into Genius to use Rap Clouds?
					</Typography>
					<Typography
						alignItems="center"
						variant="body1"
						className={classNames(classes.whiteLetters)}
					>
						Genius makes this project possible with the amazing set of data they
						have collected! To use that data, we must have you sign in for now!
					</Typography>
				</Grid>
			</Grid>
			<Grid
				id="stepsSection"
				item
				container
				xs={12}
				className={classNames(classes.fullSection, classes.stepsSection)}
			>
				<Grid
					item
					container
					xs={12}
					wrap="nowrap"
					className={classNames(
						classes.step,
						classes.whiteLetters,
						classes.primaryDarkBacking
					)}
					alignContent="stretch"
					alignItems="center"
					justifyContent="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(
								classes.stepNumber,
								classes.floater,
								classes.whiteLetters,
								classes.secondaryMainBacking
							)}
						>
							1
						</IconButton>
					</Grid>

					<Grid item xs={7} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">Go to Genius</Typography>
						<Typography variant="body2">(1.5 sec) </Typography>
					</Grid>

					<Grid
						item
						container
						xs={3}
						justifyContent="center"
						alignItems="center"
					>
						<IconButton
							item="true"
							component="a"
							href={getSocketURL()}
							disabled={!!!getSocketURL()}
							target="_blank"
							className={classNames(
								classes.stepNumber,
								classes.whiteLetters,
								classes.secondaryMainBacking
							)}
						>
							<ArrowIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					wrap="nowrap"
					className={classNames(
						classes.step,
						classes.whiteLetters,
						classes.primaryLightBacking
					)}
					alignContent="stretch"
					alignItems="center"
					justifyContent="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(
								classes.stepNumber,
								classes.floater,
								classes.whiteLetters,
								classes.primaryMainBacking
							)}
						>
							2
						</IconButton>
					</Grid>

					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">
							Sign in with Facebook, Google, Twitter, Email
						</Typography>
						<Typography variant="body2">(2.4 sec) </Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					wrap="nowrap"
					className={classNames(
						classes.step,
						classes.whiteLetters,
						classes.secondaryMainBacking
					)}
					alignContent="stretch"
					alignItems="center"
					justifyContent="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(
								classes.stepNumber,
								classes.floater,
								classes.whiteLetters,
								classes.primaryDarkBacking
							)}
						>
							3
						</IconButton>
					</Grid>
					<Grid item xs={10} className={classNames(classes.stepExplanation)}>
						<Typography variant="h4">
							Authorize us to use your Genius account
						</Typography>
						<Typography variant="body2">(1.2 sec) </Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					xs={12}
					wrap="nowrap"
					className={classNames(
						classes.step,
						classes.whiteLetters,
						classes.primaryDarkBacking
					)}
					alignContent="stretch"
					alignItems="center"
					justifyContent="center"
					direction="row"
				>
					<Grid item xs={2}>
						<IconButton
							size="medium"
							className={classNames(
								classes.stepNumber,
								classes.floater,
								classes.whiteLetters,
								classes.secondaryMainBacking
							)}
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
		</Grid>
	);
};

export default connect(
	(state) => ({ userId: selectors.getUserMongoId(state) }),
	{
		setUser,
		fetchClouds,
		addSongs,
		updateUser,
	}
)(SignIn);
