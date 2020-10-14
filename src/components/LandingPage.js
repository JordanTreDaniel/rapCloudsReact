import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { classNames } from '../utils';

const useStyles = makeStyles((theme) => {
	return {
		aboutPageContainer: {
			minWidth: '100%',
			minHeight: '91vh',
			maxWidth: '100vw',
		},
		fullSection: {
			minWidth: '100%',
			// minHeight: '100%',//Why doesn't 100% work?
			minHeight: '91vh',
			maxHeight: '100vh',
		},
		centeredChildren: {
			display: 'flex',
			flexFlow: 'column wrap',
			justifyContent: 'center',
			alignItems: 'stretch',
		},
		questionSection: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.contrastText,
			padding: '1em',
		},
		answerSection: {
			marginTop: '2em',
			marginBottom: '2em',
			padding: '1em',
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
			backgroundColor: theme.palette.primary.main,
		},
		exampleCloud: {
			backgroundImage: `url(\"${process.env.PUBLIC_URL}/rapClouds.png\")`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center center',
			backgroundSize: 'contain',
		},
	};
});

const LandingPage = (props) => {
	const {} = props;
	const classes = useStyles();
	return (
		<Paper classes={{ root: classes.aboutPageContainer }} elevation={0}>
			<div className={classNames(classes.questionSection, classes.fullSection, classes.centeredChildren)}>
				<div>
					<Typography variant="h1">What are</Typography>
					<Typography variant="h1">
						<span className={classNames(classes.greyText, classes.bold)}>Rap Clouds</span>?
					</Typography>
				</div>
			</div>
			<div className={classNames(classes.fullSection, classes.answerSection, classes.centeredChildren)}>
				<div>
					<Typography variant="h3">
						They're the <span className={classes.blueText}>lyrics</span> to your{' '}
						<span className={classes.blueText}>favorite song</span>...
					</Typography>
					<br />
					<Typography variant="h3">
						...in a <span className={classes.blueText}>word cloud</span>.
					</Typography>
				</div>
			</div>
			<div
				id="aWordCloudIs"
				className={classNames(
					classes.fullSection,
					classes.answerSection,
					classes.centeredChildren,
					classes.aWordCloudIs,
				)}
			>
				<div
					style={{
						flexGrow: 1,
					}}
					className={classNames(classes.centeredChildren)}
				>
					<Typography variant="h4" className={classes.blueText}>
						A word cloud is a way to visualize which words appear most often in any given text.
					</Typography>
					<br />
					<Typography variant="h6">The words that appear the most times will appear the largest.</Typography>
				</div>
				<div
					style={{
						flexGrow: 1,
					}}
					className={classNames(classes.exampleCloud)}
				/>
			</div>
		</Paper>
	);
};

LandingPage.defaultProps = {
	songs: [],
};

export default LandingPage;
