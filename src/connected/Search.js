import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Input, IconButton } from '@material-ui/core';
import { searchSongs, setSongSearchTerm } from '../redux/actions';
import * as selectors from '../redux/selectors';
import SearchSongList from './SearchSongList';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => ({
	mainSearchInput: {
		fontSize: '4em',
		fontWeight: 560,
		margin: '.12em 3vw .12em 9vw',
		color: theme.palette.secondary.main,
		opacity: '.72',
	},
	masterBox: {
		backgroundColor: theme.palette.primary.dark,
	},
	searchBar: {},
	searchIcon: {
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.main,
		opacity: '.72',
		marginRight: '9vw',
		'&:hover': {
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.main,
		},
	},
}));

const Search = (props) => {
	const { setSongSearchTerm, searchTerm, songSearchLoading, searchSongs, songs } = props;
	const search = () => {
		searchSongs(searchTerm);
	};
	useEffect(
		() => {
			if (!songs.length && !searchTerm.length) {
				searchSongs('drake');
			}
		},
		[ songs, searchTerm, searchSongs ],
	);
	const classes = useStyles();
	return (
		<div className={classes.masterBox}>
			<div className={classes.searchBar}>
				<DebouncedTextField
					type="text"
					onChange={(e) => {
						const { value: newSearchTerm } = e.target;
						setSongSearchTerm(newSearchTerm);
						console.log({ newSearchTerm });
						newSearchTerm.length && search(newSearchTerm);
					}}
					value={searchTerm}
					disableUnderline
					fullWidth
					placeholder="Search..."
					inputProps={{ className: classes.mainSearchInput }}
					rowsMax={1}
					autoFocus
					endAdornment={
						<IconButton
							className={classes.searchIcon}
							aria-label="search-icon"
							component="span"
							onClick={search}
						>
							<SearchIcon />
						</IconButton>
					}
				/>
			</div>

			<SearchSongList songs={songs} loading={songSearchLoading} />
		</div>
	);
};

const mapState = (state) => ({
	songs: selectors.getSongsList(state),
	searchTerm: selectors.getSearchTerm(state),
	songSearchLoading: selectors.isSongSearchLoading(state),
});

Search.defaultProps = {
	searchSongs: () => console.log('No function set for searchSongs'),
	setSongSearchTerm: () => console.log('No function set for setSongSearchTerm'),
	songs: [],
	searchTerm: 'No search term provided.',
};
export default connect(mapState, { searchSongs, setSongSearchTerm })(Search);
