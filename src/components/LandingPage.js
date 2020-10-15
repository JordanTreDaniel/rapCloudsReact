import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	withWidth,
	Paper,
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
			height: '100vh',
		},
		centeredChildren: {
			display: 'flex',
			flexFlow: 'column wrap',
			justifyContent: 'center',
			alignItems: 'stretch',
		},
		whatIsAWordCloud: {
			height: '91vh',
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
			overflowY: 'fit-content',
			height: 'fit-content',
		},
		exampleCloud: {
			backgroundImage: `url(\"${process.env.PUBLIC_URL}/Heaven Rap Cloud.png\")`,
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
	};
});

const LandingPage = (props) => {
	const { width } = props;
	const classes = useStyles();
	const [ imgZoomOpen, toggleImgZoom ] = useState(false);
	return (
		<Paper classes={{ root: classes.aboutPageContainer }} elevation={0}>
			<div
				className={classNames(
					classes.questionSection,
					classes.fullSection,
					classes.centeredChildren,
					classes.whatIsAWordCloud,
				)}
			>
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
			<Grid
				id="aWordCloudIs"
				container
				className={classNames(classes.fullSection, classes.answerSection, classes.aWordCloudIs)}
			>
				<Grid
					item
					xs={12}
					sm={6}
					style={{
						flexGrow: 1,
						padding: '1em',
					}}
					className={classNames(classes.centeredChildren)}
				>
					<Typography variant="h4" className={classes.blueText}>
						A word cloud is a way to visualize which words appear most often in any given text.
					</Typography>
					<br />
					<Typography variant="h6">The words that appear most often will appear the largest.</Typography>
					<Typography variant="body1" className={classNames(classes.blueText)} style={{ paddingTop: '3em' }}>
						This is a RapCloud made from Mary Mary's wonderful song, "Heaven".
					</Typography>
					<Typography component={Link} to={`/clouds/1376209`}>
						Go here for the full lyrics
					</Typography>
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
											{`\"I gotta get myself together, cuz I got someplace to go \n And I'm praying when I
										get there, I see everyone I know \n I wanna go to heaven, \n I wanna go to heaven \n Said
										I wanna go to heaven, \n I wanna go to heaven \n Do you wanna go?\"`}
											<Link to={`/clouds/1376209`} style={{ color: 'white' }}>
												Go here for the full lyrics
											</Link>
										</Typography>
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
		</Paper>
	);
};

LandingPage.defaultProps = {
	songs: [],
};

export default withWidth()(LandingPage);
