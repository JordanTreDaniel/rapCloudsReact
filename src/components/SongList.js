import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
	return {
		root: {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
			overflow: 'hidden',
			backgroundColor: theme.palette.background.paper,
			maxWidth: '',
			minWidth: '20em',
			margin: '2em'
		},
		media: {
			height: 140
		},
		songList: {
			display: 'flex',
			justifyContent: 'space-evenly',
			flexWrap: 'wrap'
		},
		gridList: {
			width: 500,
			height: 450
		}
	};
});

const SongList = (props) => {
	const { songs } = props;
	const classes = useStyles;
	let cols = 1;
	return (
		<div className={classes.root}>
			<GridList cellHeight={160} className={classes.gridList} cols={3}>
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
	songs: []
};

export default SongList;
