import React, { useState, useEffect, Fragment } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Toolbar,
	Grid,
	Avatar,
	Tooltip,
	Paper,
	IconButton,
	withWidth,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloudDone from '@material-ui/icons/CloudDone';
import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails, answerQuestion } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { classNames } from '../utils';
import LoadingBar from '../components/LoadingBar';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
	return {
		artistGamePage: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		artistAvatar: {
			width: '3.3em',
			height: '3.3em',
		},
		artistName: {
			fontSize: '2.4em',
		},
		miniCloud: {
			marginRight: '.6em',
		},
		unanswered: {
			color: theme.palette.primary.dark,
		},
		green: {
			color: theme.palette.success.main,
		},
		red: {
			color: theme.palette.error.main,
		},
		correctAnswer: {
			border: `3px solid ${theme.palette.success.main} !important`,
		},
		incorrectAnswer: {
			border: `3px solid ${theme.palette.error.main} !important`,
		},
		quizBoxContainer: {},
		cloud: {
			height: '90%',
			margin: 'auto',
		},
		decoyAnswer: {
			border: `3px solid ${theme.palette.secondary.main}`,
		},
		answerChoice: {
			margin: '.6em',
			borderRadius: '21px',
			padding: 'inherit',
			cursor: 'pointer',
		},
		scoreBoard: {
			overflowX: 'scroll',
		},
	};
});

const _QuizBox = (props) => {
	const { question, fetchSongDetails, answerQuestion, song, clouds, gameId, questionIdx } = props;
	const classes = useStyles();
	const cloud = clouds[0] || {};
	const { answers, answerIdx } = question;
	const { info } = cloud;
	const isAnswered = answerIdx == 0 || answerIdx;
	useEffect(() => {
		if (!info) fetchSongDetails(song.id);
	}, []);
	return (
		<Grid container direction="column" className={classes.quizBoxContainer}>
			<Grid item container direction="column">
				<img item src={info && info.secure_url} className={classes.cloud} />
			</Grid>
			<Grid item>
				<List>
					{answers.map((a, i) => {
						const thisAnswerChosen = answerIdx == i;
						return (
							<ListItem>
								<Box
									className={classNames(
										classes.answerChoice,
										isAnswered
											? a.correct
												? classes.correctAnswer
												: thisAnswerChosen ? classes.incorrectAnswer : classes.decoyAnswer
											: classes.decoyAnswer,
									)}
									onClick={() => answerQuestion(gameId, questionIdx, i)}
								>
									<ListItemText>{a.title}</ListItemText>
								</Box>
							</ListItem>
						);
					})}
				</List>
			</Grid>
		</Grid>
	);
};

const mapStateQB = (state, ownProps) => {
	return {
		song: selectors.getSongFromId(state, ownProps.question.songId),
		clouds: selectors.getCloudsForSong(state, ownProps.question.songId),
	};
};
const QuizBox = connect(mapStateQB, { fetchSongDetails, answerQuestion })(withWidth()(_QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const { fetchArtistGame, fetchSongDetails, game } = props;
	useEffect(() => {
		if (!game) fetchArtistGame(artistId);
	});
	const { questions = [], artist } = game || {};
	if (!questions.length || !artist) {
		return <h1>Loading</h1>;
	}
	const question = questions[questionIdx];
	return (
		<Grid className={classes.artistGamePage}>
			<Grid
				container
				direction="row"
				wrap="nowrap"
				alignContent="center"
				justify="space-around"
				className={classes.scoreBoard}
			>
				{questions.map((question, index) => {
					let children;
					const { answerIdx } = question;
					const answer = question.answers[answerIdx];
					if (!answer) {
						children = <CloudQueue className={classNames(classes.miniCloud, classes.unanswered)} />;
					} else if (answer.correct) {
						children = <CloudDone className={classNames(classes.miniCloud, classes.green)} />;
					} else {
						children = <CloudOff className={classNames(classes.miniCloud, classes.red)} />;
					}
					return (
						<Grid item key={index}>
							{children}
						</Grid>
					);
				})}
			</Grid>
			<Typography align="center" variant="h6">
				Which {artist.name} song was this RapCloud made from?
			</Typography>
			<QuizBox
				question={question}
				gameId={game.id}
				questionIdx={questionIdx}
				fetchSongDetails={fetchSongDetails}
			/>
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails })(
	withWidth()(ArtistGame),
);
