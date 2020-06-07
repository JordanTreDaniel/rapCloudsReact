import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = {
	root: {
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
	}
};

const SongList = (props) => {
	//TO-DO: Make SongCard component before MVP branch closes.
	const { classes, songs } = props;
	return (
		<div className={classes.songList}>
			{songs.map((song, idx) => {
				return (
					<Card className={classes.root} key={idx}>
						<CardActionArea>
							<CardMedia
								className={classes.media}
								image={song.header_image_thumbnail_url}
								title={song.full_title}
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									{song.full_title}
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button
								size="small"
								color="primary"
								href={`https://genius.com${song.path}`}
								target="_blank"
							>
								Genius
							</Button>
							<Link to={`/clouds/${song.id}`}>
								<Button size="small" color="primary">
									RapCloud
								</Button>
							</Link>
						</CardActions>
					</Card>
				);
			})}
		</div>
	);
};

SongList.defaultProps = {
	songs: []
};

const StyledSongList = withStyles(styles)(SongList);
export default StyledSongList;
