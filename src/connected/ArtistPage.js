import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Typography, AppBar, Toolbar, Grid, Avatar, Tooltip, Paper, IconButton, withWidth } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { fetchArtist, genArtistCloud } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { classNames } from '../utils';
import LoadingBar from '../components/LoadingBar';

const useStyles = makeStyles((theme) => {
	return {
		artistPage: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		buttonBox: {
			display: 'flex',
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light,
		},
		artistBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly',
		},
		leftBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly',
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
		headerBox: {
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
		songsPaper: {},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.primary.dark,
		},
		sectionToggleBtn: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.main,
			margin: '.5em',
			width: '2em',
			height: '2em',
			position: 'absolute',
			top: '-1em',
			left: '-1em',
			zIndex: 2,
			'&:hover': {
				backgroundColor: theme.palette.primary.light,
				color: theme.palette.primary.dark,
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
		cloudActionsTop: {},
		cloudActionsBottom: {},
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	const {
		artist,
		fetchArtist,
		isArtistLoading,
		isArtistCloudLoading,
		areSongLyricsLoading,
		clouds,
		genArtistCloud,
	} = props;
	const { artistId } = useParams();
	const [ cloudExpanded, setCloudExpanded ] = useState(true);
	const [ songsExpanded, setSongsExpanded ] = useState(true);
	const toggleCloudExpanded = () => setCloudExpanded(!cloudExpanded);
	const toggleSongsExpanded = () => setSongsExpanded(!songsExpanded);
	useEffect(
		() => {
			if (artistId) {
				fetchArtist(artistId);
			}
		},
		[ artistId, fetchArtist ],
	);

	if (!artistId) return <Redirect to={paths.search} />;
	if (!artist && !isArtistLoading) return null;

	const { name, path } = artist || {};

	return (
		<Grid className={classes.artistPage}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div className={classes.leftBubbles}>
						<BackButton />
						<Tooltip placement="bottom" title={`See ${name} on Genius`}>
							<a
								href={`https://genius.com${path}`}
								alt={`${name} on Genius`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
							</a>
						</Tooltip>
					</div>
				</Toolbar>
			</AppBar>
			<Grid className={classes.mainContent} container>
				<LoadingBar loading={isArtistLoading} />
				<Grid item xs={12}>
					<div className={classes.headerBox}>
						<Typography variant="h3" className={classes.header}>
							{name}
						</Typography>
					</div>
				</Grid>
				<Grid item xs={12} sm={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classNames(classes.wordCloudPaper, classes.sectionPaper)}>
						<IconButton className={classes.sectionToggleBtn} onClick={toggleCloudExpanded}>
							{cloudExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						{cloudExpanded && (
							<RapCloud
								generateCloud={() => {
									genArtistCloud(artistId);
								}}
								cloudName={name}
								clouds={clouds}
								isLoading={isArtistCloudLoading || isArtistLoading || areSongLyricsLoading}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12} sm={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classNames(classes.songsPaper, classes.sectionPaper)}>
						<IconButton className={classes.sectionToggleBtn} onClick={toggleSongsExpanded}>
							{songsExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Songs
						</Typography>
						<LoadingBar loading={isArtistLoading} />
						{songsExpanded && !isArtistLoading && <ArtistSongList artistId={artistId} />}
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	artist: selectors.getCurrentArtist(state),
	isArtistLoading: selectors.isArtistLoading(state),
	isArtistCloudLoading: selectors.isArtistCloudLoading(state),
	areSongLyricsLoading: selectors.areSongLyricsLoading(state),
	clouds: selectors.getCloudsForArtist(state),
});

export default connect(mapState, { fetchArtist, genArtistCloud })(withWidth()(ArtistPage));
