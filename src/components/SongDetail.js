import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchArtist } from '../redux/actions';
import { connect } from 'react-redux';
import RapCloud from './RapCloud';
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
		lyrics: {
			whiteSpace: 'pre-line'
		},
		lyricBox: {}
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, history, songId, fetchArtist } = props;
	if (!songId) return <Redirect to="/search" />;
	const { normalizedLyrics } = song;
	const { full_title, path, writer_artists, primary_artist, lyrics } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];

	return (
		<Grid>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div>
						<a href={`https://genius.com${path}`} alt={`${song.full_title} on Genius`} target="_blank">
							<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
						</a>
					</div>

					<div className={classes.artistBubbles}>
						{artists.map((artist, idx) => {
							return (
								<Avatar
									src={artist.header_image_url}
									alt={artist.name}
									key={idx}
									onClick={() => fetchArtist(artist.id)}
								/>
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
			<RapCloud history={history} normalizedLyrics={normalizedLyrics} songTitle={full_title} />
			<Grid item sm={12} md={12} classes={{ root: classes.lyricBox }}>
				<Typography variant="p" classes={{ root: classes.lyrics }}>
					{lyrics}
				</Typography>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state),
	songId: selectors.getCurrentSongId(state)
});

export default connect(mapState, { fetchArtist })(SongDetail);
