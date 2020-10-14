import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { classNames } from '../utils';

const useStyles = makeStyles((theme) => {
	return {
		aboutPageContainer: {
			minWidth: '100%',
			minHeight: '100vh',
			maxWidth: '100vw',
		},
		fullSection: {
			minWidth: '100%',
			minHeight: '100%',
			padding: '1em',
		},
		questionSection: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.contrastText,
		},
		answerSection: {},
		blueText: {
			color: theme.palette.secondary.light,
		},
		greyText: {
			color: theme.palette.primary.main,
		},
		bold: {
			fontWeight: theme.typography.fontWeightBold,
		},
	};
});

const LandingPage = (props) => {
	const {} = props;
	const classes = useStyles();
	return (
		<Paper classes={{ root: classes.aboutPageContainer }} elevation={0}>
			<div className={classNames(classes.questionSection, classes.fullSection)}>
				<Typography variant="h1">What are</Typography>
				<Typography variant="h1">
					<span className={classNames(classes.greyText, classes.bold)}>Rap Clouds</span>?
				</Typography>
			</div>
			<div className={classNames(classes.fullSection, classes.answerSection)}>
				<Typography variant="h3">
					They're the <span className={classes.blueText}>lyrics</span> to your{' '}
					<span className={classes.blueText}>favorite song</span>...
				</Typography>
				<br />
				<Typography variant="h3">
					...in a <span className={classes.blueText}>word cloud</span>.
				</Typography>
			</div>
		</Paper>
	);
};

LandingPage.defaultProps = {
	songs: [],
};

export default LandingPage;
