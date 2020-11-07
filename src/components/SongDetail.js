import React, { useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import { Typography, AppBar, Toolbar, Grid, Avatar, Tooltip, Paper, IconButton, withWidth } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails, fetchSongCloud } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import BackButton from './BackButton';
import LoadingBar from './LoadingBar';
import RapCloud from '../connected/RapCloud';
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
			overflowX: "hidden"
		},
		artistBubble: {
			marginLeft: '.333em'
		},
		leftBubbles: {
		},
		lyrics: {
			whiteSpace: 'pre-line',
			textAlign: 'center',
		},
		mainContentChild: { width: '100%' },
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
			color: theme.palette.secondary.light,
			fontWeight: 600,
		},
		wordCloudPaper: {
			padding: '1em',
			margin: '1em',
			position: 'relative',
			// paddingBottom: '3em',
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.light}`,
		},
		lyricsPaper: {
			padding: '1em',
			margin: '1em',
			position: 'relative',
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.light}`,
		},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.secondary.light,
		},
		headerAction: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
			margin: '.5em',
			width: '2em',
			height: '2em',
			'& a': {
				textDecoration: 'none',
				color: theme.palette.secondary.light,
				backgroundColor: theme.palette.primary.dark,
			},
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
				color: theme.palette.primary.dark,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.secondary.light,
					color: theme.palette.primary.dark,
				},
			},
		},
		appAction: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.dark,
			margin: '.5em',
			width: '2em',
			height: '2em',
			position: 'absolute',
			top: '-1em',
			left: '-1em',
			zIndex: 2,
			'& a': {
				textDecoration: 'none',
				color: theme.palette.primary.dark,
				backgroundColor: theme.palette.secondary.light,
			},
			'&:hover': {
				backgroundColor: theme.palette.primary.dark,
				color: theme.palette.secondary.light,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.primary.dark,
					color: theme.palette.secondary.light,
				},
			},
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
	const { song, fetchSongDetails, isSongDetailLoading, isWordCloudLoading, width, fetchSongCloud, areSongLyricsLoading } = props;
	const { songId } = useParams();
	const [ lyricsExpanded, setLyricsExpanded ] = React.useState(false);
	const [ cloudExpanded, setCloudExpanded ] = React.useState(true);
	const toggleLyricsExpanded = () => setLyricsExpanded(!lyricsExpanded);
	const toggleCloudExpanded = () => setCloudExpanded(!cloudExpanded);
	useEffect(
		() => {
			if (songId) {
				fetchSongDetails(songId);
			}
		},
		[ songId ],
	);

	if (!songId) return <Redirect to={paths.search} />;
	if (!song) return null;

	const { full_title, path, writer_artists, primary_artist, lyrics, encodedCloud } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];
	const [ briefedTitle, restOfTitle ] = full_title.split(/\sby\s/g);

	return (
		<Grid className={classes.songDetailContainer}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Grid id="bubbleContainer" container direction="row" wrap="nowrap" >
						<Grid id="leftBubbles" xs={4} item container direction="row" wrap="nowrap" alignItems="center" className={classes.leftBubbles}>
							<BackButton />
							<Tooltip  placement="bottom" title={`See ${briefedTitle} on Genius`}>
								<a href={`https://genius.com${path}`} alt={`${briefedTitle} on Genius`} target="_blank">
									<Avatar   src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
								</a>
							</Tooltip>
						</Grid>
						<Grid id="artistBubbles" xs={8} item container direction="row" wrap="nowrap" alignItems="center" justify="flex-end"className={classes.artistBubbles}>
							{artists.map((artist, idx) => {
								return (
									<Tooltip placement="bottom" title={`See ${artist.name}`} key={idx}>
										<Link to={`/cloudmakers/${artist.id}`}>
											<Avatar item className={classes.artistBubble} src={artist.header_image_url} alt={`Link to ${artist.name}'s page`} />
										</Link>
									</Tooltip>
								);
							})}
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Grid className={classes.mainContent} container>
				<LoadingBar loading={isSongDetailLoading} />
				<Grid item xs={12}>
					<div className={classes.songHeader}>
						<Typography variant="h3" className={classes.header}>
							{briefedTitle}
						</Typography>
						<Typography variant="small" className={classes.header}>
							{`by ${restOfTitle}`}
						</Typography>
					</div>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper className={classes.wordCloudPaper} elevation={0}>
						<IconButton className={classes.appAction} onClick={toggleCloudExpanded}>
							{cloudExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						{cloudExpanded && (
							<RapCloud
								fetchCloud={() => fetchSongCloud(songId, lyrics)}
								cloudName={briefedTitle}
								encodedCloud={encodedCloud}
								isLoading={isWordCloudLoading || isSongDetailLoading || areSongLyricsLoading}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper className={classes.lyricsPaper} elevation={0}>
						<IconButton className={classes.appAction} onClick={toggleLyricsExpanded}>
							{lyricsExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
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
});

export default connect(mapState, { fetchSongDetails, fetchSongCloud })(withWidth()(SongDetail));
