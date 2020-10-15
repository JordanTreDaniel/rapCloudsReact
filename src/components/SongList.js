import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar, LinearProgress, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LoadingBar from './LoadingBar';

const useStyles = makeStyles((theme) => {
	return {
		songListContainer: {
			width: '100%',
			height: '80vh',
			margin: 'auto',
			textAlign: 'left',
			flexGrow: 5,
			overflow: 'hidden',
			display: 'flex',
			flexFlow: 'row wrap',
			justifyContent: 'space-around',
			backgroundColor: theme.palette.primary.dark,
			maxWidth: '100vw',
			minWidth: '20em',
		},
		gridListContainer: {
			marginLeft: '1em',
			marginRight: '1em',
			flexGrow: '2',
			overflowX: 'hidden',
			maxHeight: '100%',
			border: `3px solid ${theme.palette.primary.light}`,
		},
		gridList: {
			width: '100%',
			maxHeight: '100%',
			backgroundColor: theme.palette.primary.dark,
		},
	};
});

const SongList = (props) => {
	const { songs, loading } = props;
	const classes = useStyles();
	let cols = 1;
	return (
		<div className={classes.songListContainer}>
			<LoadingBar loading={loading} />
			<Paper className={classes.gridListContainer} elevation={0}>
				<GridList cellHeight={'333'} component="div" classes={{ root: classes.gridList }} cols={3}>
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
			</Paper>
		</div>
	);
};

SongList.defaultProps = {
	songs: [],
};

export default SongList;
