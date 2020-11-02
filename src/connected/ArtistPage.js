import React, { useState, useEffect } from 'react';
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
	Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { fetchArtist, fetchArtistCloud } from '../redux/actions';
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
		songsPaper: {
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
		cloudActionsTop: {},
		cloudActionsBottom: {},
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	const { artist, fetchArtist, isArtistLoading, isArtistCloudLoading, width } = props;
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
		[ artistId ],
	);

	if (!artistId) return <Redirect to={paths.search} />;
	if (!artist && !isArtistLoading) return null;

	const { name, encodedCloud, path } = artist || {};

	return (
		<Grid className={classes.artistPage}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div className={classes.leftBubbles}>
						<BackButton />
						<Tooltip placement="bottom" title={`See ${name} on Genius`}>
							<a href={`https://genius.com${path}`} alt={`${name} on Genius`} target="_blank">
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
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classes.wordCloudPaper}>
						<IconButton className={classes.appAction} onClick={toggleCloudExpanded}>
							{cloudExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						{cloudExpanded && (
							<RapCloud
								fetchCloud={fetchArtistCloud}
								cloudName={name}
								encodedCloud={encodedCloud}
								isLoading={isArtistCloudLoading}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classes.songsPaper}>
						<IconButton className={classes.appAction} onClick={toggleSongsExpanded}>
							{songsExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Songs
						</Typography>
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
});

export default connect(mapState, { fetchArtist, fetchArtistCloud })(withWidth()(ArtistPage));
