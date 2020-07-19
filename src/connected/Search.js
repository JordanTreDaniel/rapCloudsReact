import React from 'react';
import { connect } from 'react-redux';
import LoadingCloud from '../components/LoadingCloud';
import { Input, IconButton } from '@material-ui/core';
import { searchSongs, setSongSearchTerm } from '../redux/actions';
import * as selectors from '../redux/selectors';
import SearchSongList from './SearchSongList';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

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
	songListContainer: { width: '80vw', margin: 'auto', textAlign: 'left' },
	mainSearchInput: { fontSize: '3em', marginRight: '2em', marginLeft: '2em' }
});

const Search = (props) => {
	const { setSongSearchTerm, searchTerm, loading, searchSongs } = props;
	const search = () => {
		const { searchTerm } = props;
		searchSongs(searchTerm);
	};
	const classes = useStyles();
	return (
		<div className={'masterBox'}>
			<div className={'searchBar'}>
				<DebouncedTextField
					type="text"
					onChange={(e) => {
						const { value: searchTerm } = e.target;
						setSongSearchTerm(searchTerm);
						searchTerm.length && search(searchTerm);
					}}
					value={searchTerm}
					disableUnderline
					fullWidth
					placeholder="Search Songs..."
					inputProps={{ className: classes.mainSearchInput }}
					rowsMax={1}
					autoFocus
					endAdornment={
						<IconButton color="light" aria-label="search-icon" component="span" onClick={search}>
							<SearchIcon />
						</IconButton>
					}
				/>
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
