import React, { useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import { Typography, AppBar, Toolbar, Grid, Avatar, Tooltip, Paper, IconButton, withWidth } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails, genSongCloud, fetchSongLyrics } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import BackButton from './BackButton';
import LoadingBar from './LoadingBar';
import YoutubeVideo from './YoutubeVideo';
import RapCloud from '../connected/RapCloud';
import { classNames } from '../utils';
import { Refresh } from '@material-ui/icons';
const useStyles = makeStyles((theme) => {
	return {
		songDetailContainer: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		buttonBox: {
			display: 'flex',
		},
		toolBar: {
			backgroundColor: theme.palette.primary.light,
		},
		artistBubbles: {
			overflowX: 'hidden',
		},
		artistBubble: {
			marginLeft: '.333em',
		},
		leftBubbles: {},
		lyrics: {
			whiteSpace: 'pre-line',
			textAlign: 'center',
		},
		loadingDiv: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2),
			},
			marginTop: '40%',
		},
		wordCloud: {
			width: '100%',
			margin: 'auto',
			marginBottom: '3em',
		},
		songHeader: {
			display: 'flex',
			flexFlow: 'column wrap',
			alignContent: 'center',
			textAlign: 'center',
			marginTop: '1em',
		},
		mainContent: {
			width: '100%',
			height: '100%',
			paddingBottom: '6em',
		},
		header: {
			color: theme.palette.primary.dark,
			fontWeight: 600,
		},
		sectionPaper: {
			padding: '1em',
			margin: '1em',
			position: 'relative',
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.light}`,
		},
		wordCloudPaper: {},
		lyricsPaper: {},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.primary.dark,
		},
		sectionActionBtn: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.main,
			margin: '.5em',
			width: '2em',
			height: '2em',
			position: 'absolute',
			zIndex: 2,
			'&:hover': {
				backgroundColor: theme.palette.primary.light,
				color: theme.palette.primary.dark,
			},
		},
		sectionToggleBtn: {
			top: '-1em',
			left: '-1em',
		},
		lyricRefreshBtn: {
			top: '3em',
			left: '-1em',
		},
		headerActionLink: { borderRadius: '50%' },
		cloudActions: {
			backgroundColor: theme.palette.primary.main,
			display: 'flex',
			flexFlow: 'row nowrap',
			// position: 'absolute',
			alignItems: 'center',
			justifyContent: 'space-around',
			overflowX: 'scroll',
			width: '100%',
			padding: '.5em',
			paddingLeft: '3em',
		},
		cloudActionsTop: {
			// top: '3em',
			// left: '5em',
		},
		cloudActionsBottom: {
			// bottom: '2em',
			// left: '5em',
		},
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const {
		song,
		fetchSongDetails,
		isSongDetailLoading,
		isWordCloudLoading,
		// width,
		genSongCloud,
		fetchSongLyrics,
		areSongLyricsLoading,
		clouds,
	} = props;
	const { songId } = useParams();
	const [ lyricsExpanded, setLyricsExpanded ] = React.useState(false);
	const [ cloudExpanded, setCloudExpanded ] = React.useState(true);
	const [ mediaExpanded, setMediaExpanded ] = React.useState(true);
	const toggleLyricsExpanded = () => setLyricsExpanded(!lyricsExpanded);
	const toggleCloudExpanded = () => setCloudExpanded(!cloudExpanded);
	const toggleMediaExpanded = () => setMediaExpanded(!mediaExpanded);
	useEffect(
		() => {
			if (songId) {
				fetchSongDetails(songId);
			}
		},
		[ songId, fetchSongDetails ],
	);

	if (!songId) return <Redirect to={paths.search} />;
	if (!song) return null;

	const { full_title, path, writer_artists, primary_artist, lyrics } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];
	const [ briefedTitle, restOfTitle ] = full_title.split(/\sby\s/g);

	return (
		<Grid id="songDetailContainer" className={classes.songDetailContainer}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Grid id="bubbleContainer" container direction="row" wrap="nowrap">
						<Grid
							id="leftBubbles"
							xs={4}
							item
							container
							direction="row"
							wrap="nowrap"
							alignItems="center"
							className={classes.leftBubbles}
						>
							<BackButton />
							<Tooltip placement="bottom" title={`See ${briefedTitle} on Genius`}>
								<a
									href={`https://genius.com${path}`}
									alt={`${briefedTitle} on Genius`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
								</a>
							</Tooltip>
						</Grid>
						<Grid
							id="artistBubbles"
							xs={8}
							item
							container
							direction="row"
							wrap="nowrap"
							alignItems="center"
							justify="flex-end"
							className={classes.artistBubbles}
						>
							{artists.map((artist, idx) => {
								return (
									<Tooltip placement="bottom" title={`See ${artist.name}`} key={idx}>
										<Link to={`/cloudmakers/${artist.id}`}>
											<Avatar
												item="true"
												className={classes.artistBubble}
												src={artist.header_image_url}
												alt={`Link to ${artist.name}'s page`}
											/>
										</Link>
									</Tooltip>
								);
							})}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Grid id="sdMainContent" className={classes.mainContent} container>
				<LoadingBar loading={isSongDetailLoading} />
				<Grid id="sdHeader" item xs={12}>
					<div className={classes.songHeader}>
						<Typography variant="h3" className={classes.header}>
							{briefedTitle}
						</Typography>
						<Typography variant="body2" className={classes.header}>
							{`by ${restOfTitle}`}
						</Typography>
					</div>
				</Grid>
				<Grid id="sdRapCloudSection" item xs={12} sm={6}>
					<Paper className={classNames(classes.sectionPaper)} elevation={0}>
						<IconButton
							className={classNames(classes.sectionToggleBtn, classes.sectionActionBtn)}
							onClick={toggleCloudExpanded}
						>
							{cloudExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						{cloudExpanded && (
							<RapCloud
								generateCloud={() => {
									genSongCloud(songId, lyrics);
								}}
								cloudName={briefedTitle}
								clouds={clouds}
								isLoading={isWordCloudLoading || isSongDetailLoading || areSongLyricsLoading}
							/>
						)}
					</Paper>
				</Grid>
				<Grid id="sdRapMediaSection" item xs={12} sm={6}>
					<Paper className={classNames(classes.sectionPaper)} elevation={0}>
						<IconButton
							className={classNames(classes.sectionToggleBtn, classes.sectionActionBtn)}
							onClick={toggleMediaExpanded}
						>
							{mediaExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Media
						</Typography>
						<LoadingBar loading={isSongDetailLoading} />
						{mediaExpanded && <YoutubeVideo song={song} />}
					</Paper>
				</Grid>
				<Grid id="sdLyricSection" item xs={12} sm={6}>
					<Paper className={classNames(classes.sectionPaper)} elevation={0}>
						<IconButton
							className={classNames(classes.sectionToggleBtn, classes.sectionActionBtn)}
							onClick={toggleLyricsExpanded}
						>
							{lyricsExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						{lyricsExpanded && (
							<IconButton
								className={classNames(classes.lyricRefreshBtn, classes.sectionActionBtn)}
								onClick={() => fetchSongLyrics(songId, path)}
							>
								<Refresh />
							</IconButton>
						)}

						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Lyrics
						</Typography>
						<LoadingBar loading={areSongLyricsLoading} />
						{lyricsExpanded && (
							<Typography variant="body1" classes={{ root: classes.lyrics }}>
								{lyrics}
							</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state),
	isSongDetailLoading: selectors.isSongDetailLoading(state),
	isWordCloudLoading: selectors.isWordCloudLoading(state),
	areSongLyricsLoading: selectors.areSongLyricsLoading(state),
	clouds: selectors.getCloudsForSong(state),
});

export default connect(mapState, { fetchSongDetails, genSongCloud, fetchSongLyrics })(withWidth()(SongDetail));
