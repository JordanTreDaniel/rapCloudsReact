import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingCloud from '../components/LoadingCloud';
import { Button, Input, Typography } from '@material-ui/core';
import { searchSongs, setSongSearchTerm } from '../redux/actions';
import * as selectors from '../redux/selectors';
import SearchSongList from './SearchSongList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	outerLoading: {
		width: '51vw',
		height: '51vw',
		margin: 'auto',
		backgroundImage: 'url("https://media.giphy.com/media/1uLQUtPLbJMQ0/giphy.gif")',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		borderRadius: '50%',
		display: 'flex'
	},
	innerLoading: { margin: 'auto', color: 'white', width: 'fit-content' },
	songListContainer: { width: '80vw', margin: 'auto', textAlign: 'left' }
});

const Search = (props) => {
	const { setSongSearchTerm, searchTerm, loading } = props;
	const search = () => {
		const { searchTerm } = props;
		props.searchSongs(searchTerm);
	};
	const classes = useStyles();
	return (
		<div className={'masterBox'}>
			<div className={'searchBar'}>
				<Input
					type="text"
					onChange={(e) => {
						const { value: searchTerm } = e.target;
						setSongSearchTerm(searchTerm);
					}}
					value={searchTerm}
					disableUnderline
					fullWidth
					placeholder="Search Songs..."
				/>
				<Button onClick={search}>Search</Button>
			</div>

			<div className={classes.songListContainer}>
				{loading && <LoadingCloud />}
				<SearchSongList songs={props.songs} />
			</div>
		</div>
	);
};

const mapState = (state) => ({
	songs: selectors.getSongsList(state),
	searchTerm: selectors.getSearchTerm(state),
	loading: selectors.areSongsLoading(state)
});

Search.defaultProps = {
	searchSongs: () => console.log('No function set for searchSongs'),
	setSongSearchTerm: () => console.log('No function set for setSongSearchTerm'),
	songs: [],
	searchTerm: 'No search term provided.'
};
export default connect(mapState, { searchSongs, setSongSearchTerm })(Search);
