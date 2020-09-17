import React, { useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import { Typography, AppBar, Toolbar, Grid, Avatar, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import LoadingCloud from './LoadingCloud';
import BackButton from './BackButton';

const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex'
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light
		},
		homeLink: {
			textDecoration: 'none',
			color: 'black'
		},
		artistBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly'
		},
		leftBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly'
		},
		lyrics: {
			whiteSpace: 'pre-line'
		},
		lyricBox: {},
		loadingDiv: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2)
			},
			marginTop: '40%'
		},
		wordCloud: {
			width: '90vw',
			margin: 'auto'
		}
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, fetchSongDetails, isSongDetailLoading, isWordCloudLoading } = props;
	const { songId } = useParams();
	useEffect(
		() => {
			if (songId) {
				fetchSongDetails(songId);
			}
		},
		[ songId ]
	);
	if (!songId) return <Redirect to={paths.search} />;
	if (!song) return null;

	const { full_title, path, writer_artists, primary_artist, lyrics, encodedCloud } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];

	return (
		<Grid>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div className={classes.leftBubbles}>
						<BackButton />
						<Tooltip placement="bottom" title={`See ${full_title} on Genius`}>
							<a href={`https://genius.com${path}`} alt={`${song.full_title} on Genius`} target="_blank">
								<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
							</a>
						</Tooltip>
					</div>

					<div className={classes.artistBubbles}>
						{artists.map((artist, idx) => {
							return (
								<Tooltip placement="bottom" title={`See ${artist.name}`} key={idx}>
									<Link to={`/cloudMakers/${artist.id}`}>
										<Avatar src={artist.header_image_url} alt={`Link to ${artist.name}'s page`} />
									</Link>
								</Tooltip>
							);
						})}
					</div>
				</Toolbar>
			</AppBar>
			<div>
				<Typography variant="h3" className={classes.header}>
					{full_title}
				</Typography>
			</div>
			{isWordCloudLoading ? (
				<LoadingCloud />
			) : isSongDetailLoading || !lyrics ? null : (
				<img src={`data:image/png;base64, ${encodedCloud}`} alt={'Rap Cloud'} className={classes.wordCloud} />
			)}
			{isSongDetailLoading ? (
				<LoadingCloud />
			) : (
				<Grid item sm={12} md={12} classes={{ root: classes.lyricBox }}>
					<Typography variant="body1" classes={{ root: classes.lyrics }}>
						{lyrics}
					</Typography>
				</Grid>
			)}
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state),
	isSongDetailLoading: selectors.isSongDetailLoading(state),
	isWordCloudLoading: selectors.isWordCloudLoading(state)
});

export default connect(mapState, { fetchSongDetails })(SongDetail);
