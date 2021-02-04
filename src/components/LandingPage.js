import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RapCloud from '../connected/RapCloud';
import paths from '../paths';
import {
	withWidth,
	Typography,
	Grid,
	DialogContent,
	Dialog,
	DialogTitle,
	DialogActions,
	Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { classNames } from '../utils';
import RightArrow from '@material-ui/icons/ArrowForward';
import CloudQueue from '@material-ui/icons/CloudQueue';
import { Instagram, Style } from '@material-ui/icons';

const useStyles = makeStyles((theme) => {
	return {
		aboutPageContainer: {
			minWidth: '100%',
			minHeight: '91vh',
			maxWidth: '100vw',
			backgroundColor: theme.palette.primary.main,
		},
		demoButtons: {
			position: 'absolute',
			padding: '1em',
			textAlign: 'center',
			borderRadius: '6px',
		},
		demoButtonsDesktop: {
			padding: '1em',
			bottom: '.6em',
			right: '1em',
		},
		demoButtonsMobile: {
			padding: '0',
			bottom: '0',
			right: '0',
		},
		demoButton: {
			fontSize: '1.2em',
			fontWeight: theme.typography.fontWeightBold,
			whiteSpace: 'nowrap',
			margin: '.5em',
			marginRight: '.5em',
			marginLeft: '.5em',
			boxShadow: 'none',
			border: `1px solid ${theme.palette.primary.dark}`,
			cursor: 'pointer',
		},
		tryItButton: {
			backgroundColor: theme.palette.secondary.main,
			color: theme.palette.secondary.contrastText,
			border: `1px solid ${theme.palette.primary.contrastText}`,
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
				color: theme.palette.secondary.contrastText,
			},
		},
		whatIsAButton: {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
			opacity: '.8',
			'&:hover': {
				backgroundColor: theme.palette.primary.light,
				color: theme.palette.primary.contrastText,
			},
		},
		fullSection: {
			// minWidth: '100%',
			// minHeight: '100%',//Why doesn't 100% work?
			// height: '100vh',
		},
		centeredColumn: {
			display: 'flex',
			flexFlow: 'column wrap',
			justifyContent: 'center',
			alignItems: 'stretch',
		},
		centeredRow: {
			display: 'flex',
			flexFlow: 'row wrap',
			justifyContent: 'center',
			alignItems: 'center',
		},
		backgroundVideo: {
			position: 'absolute',
			right: 0,
			bottom: 0,
			minWidth: '100%',
			height: '91vh', //TO-DO: Get it so that the MINIMUM height is 91vh, and it grows to cover the answer section on mobile
		},
		backgroundVideoBox: {},
		whatIsAWordCloud: {
			minHeight: '91vh',
		},
		questionSection: {
			color: theme.palette.primary.contrastText,
			padding: '1em',
			zIndex: '2',
			backgroundColor: 'rgba(0, 0, 0, 0.333)',
		},
		answerSection: {
			paddingTop: '2em',
			paddingBottom: '2em',
			padding: '1em',
			minHeight: '91vh',
			lineHeight: '5em',
			zIndex: '2',
			textAlign: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.333)',
		},
		explanationSection: {
			marginTop: '2em',
			marginBottom: '2em',
			padding: '1em',
			minHeight: '72vh',
		},
		blueText: {
			color: theme.palette.secondary.light,
		},
		greyText: {
			color: theme.palette.primary.main,
		},
		bold: {
			fontWeight: theme.typography.fontWeightBold,
		},
		aWordCloudIs: {
			// backgroundColor: theme.palette.primary.main,
			overflowY: 'fit-content',
			height: 'fit-content',
		},
		exampleCloud: {
			backgroundImage: `url("${process.env.PUBLIC_URL}/Heaven Rap Cloud.png")`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center center',
			backgroundSize: 'contain',
		},
		fullScreenExample: { backgroundColor: theme.palette.primary.main },
		lyricQuote: {
			paddingLeft: '3em',
			paddingRight: '3em',
			marginTop: '3em',
			marginBottom: '3em',
		},
		plainLink: {
			color: theme.palette.primary.contrastText,
			cursor: 'pointer',
		},
		flipped: {
			transform: 'rotate(180deg)',
		},
	};
});
const sampleCloudFiles = [ 'bodyToMe.png', 'loveCycle.png', 'rightHand.png' ];
const LandingPage = (props) => {
	const { width, user } = props;
	const classes = useStyles();
	const [ imgZoomOpen, toggleImgZoom ] = useState(false);
	return (
		<Grid id="aboutPageContainer" container classes={{ root: classes.aboutPageContainer }} elevation={0}>
			<Grid item container id="backgroundVideoBox" className={classes.backgroundVideoBox} xs={12}>
				<video autoPlay muted loop className={classes.backgroundVideo}>
					<source src={`${process.env.PUBLIC_URL}/flywithme2.mp4`} type="video/mp4" />
				</video>
				<Grid
					id="questionSection"
					item
					container
					xs={12}
					sm={6}
					className={classNames(
						classes.questionSection,
						classes.fullSection,
						classes.centeredColumn,
						classes.whatIsAWordCloud,
					)}
				>
					<Grid item id="questionContainer">
						<Typography variant="h1" className={classes.blueText}>
							Welcome to
						</Typography>
						<Typography variant="h1">
							<span className={classNames(classes.greyText, classes.bold)}>Rap Clouds</span>
						</Typography>
					</Grid>
				</Grid>
				<Grid
					id="answerSection"
					item
					xs={12}
					sm={6}
					className={classNames(classes.fullSection, classes.answerSection, classes.centeredColumn)}
				>
					<Grid>
						<Typography variant="h3">
							Your favorite<span className={classes.blueText}> song lyrics</span> &{' '}
							<span className={classes.blueText}> pictures</span>...
						</Typography>
						<br />
						<Typography variant="h3">
							...in a <span className={classes.blueText}>word cloud</span>!
						</Typography>
					</Grid>
				</Grid>
				<Grid
					id="demoButtonsBox"
					item
					container
					xs={12}
					sm={9}
					direction="row"
					wrap="wrap-reverse"
					justify="flex-end"
					className={classNames(
						classes.demoButtons,
						width === 'xs' ? classes.demoButtonsMobile : classes.demoButtonsDesktop,
					)}
				>
					<Button
						variant="contained"
						item
						component={Link}
						to={user ? paths.play : paths.signIn}
						color="primary"
						disableElevation
						endIcon={<Style className={classes.flipped} />}
						className={classNames(classes.demoButton, classes.whatIsAButton)}
					>
						Play the Game
					</Button>
					<Button
						variant="contained"
						item
						component={Link}
						to={user ? paths.search : paths.signIn}
						color="secondary"
						disableElevation
						endIcon={<CloudQueue />}
						className={classNames(classes.demoButton, classes.tryItButton)}
					>
						Make a Cloud
					</Button>
				</Grid>
			</Grid>
			<Grid
				id="makeACloud"
				container
				className={classNames(classes.fullSection, classes.explanationSection, classes.aWordCloudIs)}
			>
				<Grid item xs={12} sm={6}>
					<Typography variant="h2">Make a RapCloud</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<RapCloud
						generateCloud={null}
						cloudName={'Example Clouds'}
						clouds={sampleCloudFiles.map((fileName) => {
							return { info: { secure_url: `${process.env.PUBLIC_URL}/${fileName}` } };
						})}
						isLoading={false}
						allowDeletions={false}
						allowCreation={false}
						showCloudActions={false}
					/>
				</Grid>
			</Grid>
			<Grid
				id="aWordCloudIs"
				container
				className={classNames(classes.fullSection, classes.explanationSection, classes.aWordCloudIs)}
			>
				<Grid
					item
					xs={12}
					sm={6}
					style={{
						flexGrow: 1,
						padding: '1em',
					}}
					className={classNames(classes.centeredColumn)}
				>
					<Typography variant="h4">
						A word cloud is a way to visualize which words appear most often in any given text.
					</Typography>
					<br />
					<Typography variant="h6">The words that appear most often will appear the largest.</Typography>
					<Typography variant="body1" className={classNames(classes.blueText)} style={{ paddingTop: '3em' }}>
						This is a RapCloud made from Mary Mary's wonderful song, "Heaven".
					</Typography>
					<br />
					<Grid container alignItems="center">
						<Typography item component={Link} to={`/clouds/1376209`} className={classes.plainLink}>
							Go here for the full lyrics
						</Typography>
						<RightArrow item />
					</Grid>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					style={{
						flexGrow: 1,
					}}
					// className={classNames(classes.exampleCloud)}
					onClick={() => toggleImgZoom(true)}
				>
					<img
						alt="Heaven Rap Cloud"
						src={`${process.env.PUBLIC_URL}/Heaven Rap Cloud.png`}
						style={{ width: '100%' }}
					/>
				</Grid>
				{imgZoomOpen && (
					<Dialog open={imgZoomOpen} onClose={() => toggleImgZoom(false)} fullScreen={width === 'xs'}>
						<DialogTitle>
							<Typography variant="body1" className={classNames(classes.blueText)}>
								This is a RapCloud made from Mary Mary's wonderful song, "Heaven". The chorus goes like
								this..
							</Typography>
						</DialogTitle>
						<DialogContent className={classes.fullScreenExample}>
							<Grid>
								<div>
									<div className={classes.lyricQuote}>
										<Typography variant="caption">
											{`"I gotta get myself together, cuz I got someplace to go \n And I'm praying when I
										get there, I see everyone I know \n I wanna go to heaven, \n I wanna go to heaven \n Said
										I wanna go to heaven, \n I wanna go to heaven \n Do you wanna go?"`}
										</Typography>
										<br />
										<Grid container alignItems="center">
											<Typography
												item
												component={Link}
												to={`/clouds/1376209`}
												className={classes.plainLink}
											>
												Go here for the full lyrics
											</Typography>
											<RightArrow item />
										</Grid>
									</div>
								</div>

								<img
									alt="Heaven Rap Cloud"
									src={`${process.env.PUBLIC_URL}/Heaven Rap Cloud.png`}
									style={{ width: '100%' }}
								/>
							</Grid>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => toggleImgZoom(false)}>Close</Button>
						</DialogActions>
					</Dialog>
				)}
			</Grid>
		</Grid>
	);
};

LandingPage.defaultProps = {
	songs: [],
};

export default withWidth()(LandingPage);
