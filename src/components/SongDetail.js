import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
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
		}
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, history } = props;
	if (!song) return null;
	const { full_title, path, writer_artists, primary_artist } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];
	return (
		<Grid>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div>
						<Link to={`https://genius.com${path}`} alt={`${song.full_title} on Genius`}>
							<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
						</Link>
					</div>

					<div className={classes.artistBubbles}>
						{artists.map((artist, idx) => {
							const artistPath = `/cloudMakers/${artist.id}`;
							return (
								<Link to={artistPath} key={idx}>
									<Avatar src={artist.header_image_url} alt={artist.name} />
								</Link>
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
			<RapCloud history={history} />
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state)
});

export default connect(mapState, null)(SongDetail);
