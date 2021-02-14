import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Grid, Avatar, Tooltip, Paper, IconButton, withWidth, Input, Box, Button } from '@material-ui/core';
import CloudDone from '@material-ui/icons/CloudDone';
import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchArtistGame, fetchSongDetails, answerQuestion } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { classNames } from '../utils';
import LoadingBar from '../components/LoadingBar';
import FlyWithMe from '../components/FlyWithMe';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
	return {
		artistGamePage: {
			minHeight: '91vh', //TO-DO: Why doesn't 100% height work here, but does work on ArtistPage? Content/children?
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
			cursor: 'pointer',
			textAlign: 'center',
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
		quizBoxWrapper: {},
		cloud: {
			width: '100%',
			margin: 'auto',
		},
		decoyAnswer: {
			border: `3px solid ${theme.palette.primary.light}`,
		},
		answerChoice: {
			margin: '.6em',
			borderRadius: '21px',
			padding: '.54em',
			cursor: 'pointer',
		},
		scoreBoard: {
			overflowX: 'scroll',
		},
		textPlaceholder: {
			width: '100%',
		},
		gameOverGrid: {
			marginBottom: '.3em',
		},
		playAgainLink: {
			margin: '1.2em',
			textDecoration: 'none',
			color: theme.palette.secondary.main,
		},
		loadingFrame: {
			backgroundColor: 'rgba(0, 0, 0, 0.333)',
			zIndex: 1,
			padding: '1.5em',
		},
		artistAvatar: {
			margin: 'auto',
		},
		countDown: {
			position: 'absolute',
			top: '-.45em',
			right: '-.45em',
			color: 'rgba(245, 245, 255, 0.555)',
			fontWeight: theme.typography.fontWeightBold,
		},
	};
});
let questionTimer,
	setQuestionTimer = (cb, ms = 1000) => {
		if (questionTimer) {
			clearInterval(questionTimer);
		}
		questionTimer = setInterval(cb, ms);
	};
export const QuizBox = (props) => {
	const {
		question,
		answerQuestion,
		gameId,
		questionIdx,
		updateQuestionIdx,
		isSongDetailLoading,
		isWordCloudLoading,
		areSongLyricsLoading,
		gameOver,
		answersOnBottomOnly = false,
	} = props;
	const classes = useStyles();
	const [ seconds, setSeconds ] = useState(0);
	const { answers, answerIdx, cloud, song } = question || {};
	const { info } = cloud || {};
	const isAnswered = answerIdx == 0 || answerIdx;
	const letters = [ 'A', 'B', 'C', 'D' ];
	const updateQuestionIdxDelayed = (newIdx) => {
		setTimeout(() => {
			updateQuestionIdx(newIdx);
		}, 900);
	};
	useEffect(
		() => {
			const { answerIdx } = question;
			const isAnswered = answerIdx == 0 || !!answerIdx;
			if (!isAnswered) {
				setSeconds(10);
				setQuestionTimer(() => {
					setSeconds((s) => {
						const newSeconds = s - 1;
						if (newSeconds < 0) {
							answerQuestion(gameId, questionIdx, -1);
							clearInterval(questionTimer);
							updateQuestionIdxDelayed(questionIdx + 1);
						}
						return newSeconds;
					});
				});
			}
		},
		[ questionIdx ],
	);
	if (!cloud || !answers) return null;
	return (
		<Grid item container justify="space-evenly" className={classes.quizBoxContainer}>
			<Grid item xs={12} container direction="column">
				{isAnswered ? (
					<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
						This RapCloud was made from{' '}
						<Link className={classes.blueTxt} to={`/clouds/${song.id}`}>
							{song.title}
						</Link>
					</Typography>
				) : (
					<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
						Which song was this RapCloud made from?
					</Typography>
				)}
			</Grid>
			<Grid
				item
				xs={12}
				md={answersOnBottomOnly ? 12 : 7}
				container
				direction="column"
				style={{ position: 'relative' }}
			>
				{!isAnswered && (
					<Typography variant="h2" className={classes.countDown}>
						{seconds}
					</Typography>
				)}

				<img src={info && info.secure_url} className={classes.cloud} />
			</Grid>
			<Grid item xs={12} md={answersOnBottomOnly ? 12 : 4}>
				<Grid
					container
					direction="row"
					wrap="wrap"
					justify="space-evenly"
					alignItems="center"
					alignContent="space-around"
					style={{ height: '100%' }}
				>
					{answers.map((a, i) => {
						const thisAnswerChosen = answerIdx == i;
						return (
							<Grid item key={i} xs={12} sm={6} md={answersOnBottomOnly ? 6 : 12}>
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
										updateQuestionIdxDelayed(questionIdx + 1);
									}}
								>
									<Typography>
										<span className={classes.blueTxt}>{`${letters[i]}.) `}</span>
										{`${a.title}`}
									</Typography>
								</Box>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
		</Grid>
	);
};

const ConnectedQuizBox = connect(null, { answerQuestion })(withWidth()(QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { fetchSongDetails, game, artistLoading } = props;
	const { questions = [], artist, id: gameId, gameOver, percentageRight } = game || {};
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const question = questions[questionIdx] || {};
	const { answerIdx, cloud } = question;
	const isAnswered = answerIdx == 0 || answerIdx;
	const { info } = cloud || {};
	const updateQuestionIdxSafely = (newIdx) => {
		if (newIdx >= questions.length) {
			newIdx = questions.length - 1;
		}
		updateQuestionIdx(newIdx);
	};

	let prevAnswered = false;
	useEffect(() => {
		if (isAnswered) {
			let newIdx = questionIdx + 1;
			let nextQuestion = questions[newIdx];
			let nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			while (nextQuestionAnswered) {
				newIdx++;
				if (newIdx > questions.length - 1) {
					break;
				}
				nextQuestion = questions[newIdx];
				nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			}
			updateQuestionIdxSafely(newIdx);
		}
	}, []);
	useEffect(
		() => {
			if (!info) {
				const { songId } = question;
				console.log('No info found for song. Fetching details', songId);
				songId && fetchSongDetails(songId);
			}
		},
		[ questionIdx ],
	);
	const content = (
		<Grid container item xs={12} justify="center">
			{gameOver && (
				<Grid container item justify="center" className={classes.gameOverGrid} xs={11}>
					<Typography align="center" variant="h5" className={classes.blueTxt} style={{ width: '100%' }}>
						Game Over!
					</Typography>
					<Typography align="center" style={{ width: '100%' }}>
						You got {percentageRight}% of RapClouds on {artist.name}
						Level {game.level}
					</Typography>
					<Typography align="center" style={{ width: '100%' }}>
						{game.nextLevel ? (
							<Button
								variant="contained"
								component={Link}
								to={`/games/${artist.id}/${game.nextLevel}`}
								className={classes.playAgainLink}
							>
								Level {game.nextLevel}
							</Button>
						) : null}
						<Button variant="contained" component={Link} to={paths.play} className={classes.playAgainLink}>
							New Artist
						</Button>
					</Typography>
				</Grid>
			)}
			<Grid className={classes.scoreBoard} container item xs={11} direction="row" wrap="nowrap">
				{questions.map((question, index) => {
					let children;
					const { answerIdx } = question;
					const isAnswered = answerIdx == 0 || answerIdx;
					const answer = question.answers[answerIdx] || {};
					const classesArr = [];
					if (!isAnswered) {
						classesArr.push(classes.unanswered);
						children = (
							<CloudQueue
								onClick={
									gameOver && (prevAnswered || index == 0) ? (
										() => updateQuestionIdxSafely(index)
									) : null
								}
							/>
						);
					} else if (answer.correct) {
						classesArr.push(classes.green);
						children = (
							<CloudDone
								onClick={
									gameOver && (prevAnswered || index == 0) ? (
										() => updateQuestionIdxSafely(index)
									) : null
								}
							/>
						);
					} else {
						classesArr.push(classes.red);
						children = (
							<CloudOff
								onClick={
									gameOver && (prevAnswered || index == 0) ? (
										() => updateQuestionIdxSafely(index)
									) : null
								}
							/>
						);
					}
					prevAnswered = isAnswered;
					if (index == questionIdx) classesArr.push(classes.currentMiniCloud);
					return (
						<Grid item key={index} className={classNames(classes.miniCloud, ...classesArr)} xs={2}>
							{children}
							<Typography align="center" variant="h6" className={classes.blackTxt}>
								{index + 1}
							</Typography>
						</Grid>
					);
				})}
			</Grid>
			<Grid item xs={10} className={classes.quizBoxWrapper}>
				{!!info || gameOver ? (
					<ConnectedQuizBox
						question={question}
						gameId={game.id}
						questionIdx={questionIdx}
						updateQuestionIdx={updateQuestionIdxSafely}
						gameOver={gameOver}
					/>
				) : (
					<FlyWithMe includeRightZero={false}>
						<Typography variant="h3" style={{ zIndex: 2, width: '100%' }}>
							How can we ask you this?
						</Typography>
						<Typography variant="h5" style={{ zIndex: 2, width: '100%' }}>
							Right! With a RapCloud, of course.
						</Typography>
					</FlyWithMe>
				)}
			</Grid>
		</Grid>
	);

	return content;
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
	artist: selectors.getCurrentArtist(state),
	artistLoading: selectors.isArtistLoading(state), //TO-DO: Read from the gameLoading property instead. Need to update sagas/reducers to do that.
	isSongDetailLoading: selectors.isSongDetailLoading(state),
	isWordCloudLoading: selectors.isWordCloudLoading(state),
	areSongLyricsLoading: selectors.areSongLyricsLoading(state),
});

const ConnectedArtistGame = connect(mapState, { fetchSongDetails })(withWidth()(ArtistGame));

const _ArtistGameLoadingGate = (props) => {
	const { game, fetchArtistGame, artist, width } = props;
	const { artistId, level } = useParams();
	const { gameId = null } = game || {};
	const classes = useStyles();

	useEffect(
		() => {
			if (!gameId) fetchArtistGame(artistId, level);
		},
		[ artistId, level ],
	);
	const { image_url, name } = artist;
	return (
		<Grid
			className={classes.artistGamePage}
			container
			direction="row"
			wrap="wrap"
			alignItems="flex-start"
			alignContent="flex-start"
			justify="center"
		>
			{!!game ? (
				<ConnectedArtistGame />
			) : (
				<FlyWithMe>
					<Grid
						item
						container
						justify="center"
						direction="column"
						spacing={2}
						xs={12}
						className={classes.loadingFrame}
					>
						<Typography align="center" variant="h4" style={{ marginBottom: '.5em' }}>
							{name}
						</Typography>
						<Avatar
							item
							alt={name}
							src={image_url}
							imgProps={null}
							className={classes.artistAvatar}
							style={
								width === 'xs' ? { width: '50vw', height: '50vw' } : { width: '50vh', height: '50vh' }
							}
						/>
						<Typography align="center" variant="h5" style={{ marginTop: '.5em' }}>
							Level {level}
						</Typography>
					</Grid>
				</FlyWithMe>
			)}
		</Grid>
	);
};
export default connect(mapState, { fetchArtistGame })(withWidth()(_ArtistGameLoadingGate));
