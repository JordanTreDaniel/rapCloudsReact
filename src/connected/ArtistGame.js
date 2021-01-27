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
			height: '100vh',
			width: '100%',
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
			marginRight: '1.2em',
		},
		currentMiniCloud: {
			backgroundColor: theme.palette.secondary.main,
			borderRadius: '5px',
			padding: '.12em',
		},
		blueTxt: { color: theme.palette.secondary.main },
		blackTxt: { color: theme.palette.primary.dark },
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
	const {
		questions,
		fetchSongDetails,
		answerQuestion,
		song,
		clouds,
		gameId,
		questionIdx,
		updateQuestionIdx,
		isSongDetailLoading,
		isWordCloudLoading,
		areSongLyricsLoading,
	} = props;
	const question = questions[questionIdx];
	const classes = useStyles();
	const cloud = clouds[0] || {};
	const { answers, answerIdx } = question;
	const { info } = cloud;
	const isAnswered = answerIdx == 0 || answerIdx;
	const letters = [ 'A', 'B', 'C', 'D' ];
	useEffect(
		() => {
			if (questionIdx == 0) {
				if (!info) fetchSongDetails(question.songId);
			}
			const nextQuestion = questions[questionIdx + 1];
			if (nextQuestion) {
				fetchSongDetails(nextQuestion.songId);
			}
		},
		[ questionIdx ],
	);
	useEffect(() => {
		let newIdx = questionIdx + 1;
		if (isAnswered) {
			let nextQuestion = questions[newIdx];
			let nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			while (nextQuestionAnswered) {
				newIdx++;
				nextQuestion = questions[newIdx];
				nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			}
			updateQuestionIdx(newIdx);
		}
	}, []);
	return (
		<Grid container direction="column" className={classes.quizBoxContainer}>
			{!isSongDetailLoading && !isWordCloudLoading && !areSongLyricsLoading ? info ? (
				<Fragment>
					<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
						Which song was this Cloud made from?
					</Typography>
					<Grid item container direction="column">
						<img item src={info && info.secure_url} className={classes.cloud} />
					</Grid>
					<Grid item>
						<List>
							{answers.map((a, i) => {
								const thisAnswerChosen = answerIdx == i;
								return (
									<ListItem key={i}>
										<Box
											className={classNames(
												classes.answerChoice,
												isAnswered
													? a.correct
														? classes.correctAnswer
														: thisAnswerChosen ? classes.incorrectAnswer : classes.decoyAnswer
													: classes.decoyAnswer,
											)}
											onClick={() => {
												if (isAnswered) return;
												answerQuestion(gameId, questionIdx, i);
												setTimeout(() => {
													updateQuestionIdx(questionIdx + 1);
												}, 900);
											}}
										>
											<ListItemText>
												<span className={classes.blueTxt}>{`${letters[i]}.) `}</span>
												{`${a.title}`}
											</ListItemText>
										</Box>
									</ListItem>
								);
							})}
						</List>
					</Grid>
				</Fragment>
			) : null : (
				<h1>Loading</h1>
			)}
		</Grid>
	);
};

const mapStateQB = (state, ownProps) => {
	const { questions, questionIdx } = ownProps;
	//NOTE: The props here are very similar to SongDetail. Maybe make HOC?
	return {
		song: selectors.getSongFromId(state, questions[questionIdx].songId), // Possibly not needed. Just using for song Id
		clouds: selectors.getCloudsForSong(state, questions[questionIdx].songId),
		isSongDetailLoading: selectors.isSongDetailLoading(state),
		isWordCloudLoading: selectors.isWordCloudLoading(state),
		areSongLyricsLoading: selectors.areSongLyricsLoading(state),
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
	if (questionIdx > questions.length) {
		return <h1>Game Over</h1>;
	}
	let prevAnswered = false;
	return (
		<Grid container direction="column" alignItems="center" className={classes.artistGamePage}>
			<Grid container item direction="row" wrap="nowrap" className={classes.scoreBoard} xs="9">
				{questions.map((question, index) => {
					let children;
					const { answerIdx } = question;
					const answer = question.answers[answerIdx];

					if (!answer) {
						children = (
							<CloudQueue
								className={classNames(classes.unanswered)}
								onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
							/>
						);
					} else if (answer.correct) {
						children = (
							<CloudDone
								className={classNames(classes.green)}
								onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
							/>
						);
					} else {
						children = (
							<CloudOff
								className={classNames(classes.red)}
								onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
							/>
						);
					}
					prevAnswered = answerIdx == 0 || answerIdx;
					return (
						<Grid
							item
							key={index}
							className={classNames(classes.miniCloud, index == questionIdx && classes.currentMiniCloud)}
							xs={2}
						>
							{children}
							<Typography align="center" variant="h6" className={classes.blackTxt}>
								{index + 1}
							</Typography>
						</Grid>
					);
				})}
			</Grid>
			<Grid xs="10">
				<QuizBox
					questions={questions}
					gameId={game.id}
					questionIdx={questionIdx}
					fetchSongDetails={fetchSongDetails}
					updateQuestionIdx={updateQuestionIdx}
				/>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails })(
	withWidth()(ArtistGame),
);
