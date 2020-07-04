import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchArtist, fetchSongDetails } from '../redux/actions';
import { connect } from 'react-redux';
import CurrentSongCloud from '../connected/CurrentSongCloud';
import paths from '../paths';
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
	const { song, history, fetchArtist } = props;
	const { songId } = useParams();
	if (!songId) return <Redirect to={paths.search} />;

	const { normalizedLyrics, full_title, path, writer_artists, primary_artist, lyrics } = song;
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
									onClick={() => fetchArtist(artist.id)} //TO-DO: Make this a link to artist, not dispatch fetch action
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
			<CurrentSongCloud history={history} />
			<Grid item sm={12} md={12} classes={{ root: classes.lyricBox }}>
				<Typography variant="p" classes={{ root: classes.lyrics }}>
					{lyrics}
				</Typography>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state)
});

export default connect(mapState, { fetchArtist })(SongDetail);
