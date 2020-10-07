import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar, LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
	return {
		songListContainer: {
			width: '93vw',
			height: '80vh',
			margin: 'auto',
			textAlign: 'left',
			flexGrow: 5,
			overflow: 'hidden',
			display: 'flex',
			flexFlow: 'row wrap',
			justifyContent: 'space-around',
			backgroundColor: theme.palette.background.paper,
			maxWidth: '100vw',
			minWidth: '20em',
		},
		gridList: {
			width: '93vw',
			maxHeight: '100%',
			flexGrow: '2',
			overflowX: 'hidden',
		},
		loadingBar: {
			width: '100%',
			borderRadius: '15%',
			margin: 0,
		},
		loadingBarContainer: {
			width: '100%',
			height: '.4em',
		},
	};
});

const SongList = (props) => {
	const { songs, loading } = props;
	const classes = useStyles();
	let cols = 1;
	return (
		<div className={classes.songListContainer}>
			<div className={classes.loadingBarContainer}>
				{loading && <LinearProgress color="secondary" variant="query" className={classes.loadingBar} />}
			</div>
			<GridList cellHeight={160} component="div" classes={{ root: classes.gridList }} cols={3}>
				{songs.map((song, idx) => {
					const artist = song.primary_artist;
					const { name: artistName = 'Unknown' } = artist || {};
					const item = (
						<GridListTile key={idx} cols={cols} component={Link} to={`/clouds/${song.id}`}>
							<img src={song.header_image_thumbnail_url} alt={song.full_title} />
							<GridListTileBar title={song.full_title} subtitle={<span>by: {artistName}</span>} />
						</GridListTile>
					);
					if (cols === 3) {
						cols = 1;
					} else {
						cols++;
					}
					return item;
				})}
			</GridList>
		</div>
	);
};

SongList.defaultProps = {
	songs: [],
};

export default SongList;
