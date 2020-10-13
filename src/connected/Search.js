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

const useStyles = makeStyles((theme) => ({
	mainSearchInput: {
		fontSize: '3em',
		fontWeight: 560,
		marginRight: '3vw',
		marginLeft: '9vw',
		color: theme.palette.secondary.light,
	},
	masterBox: {
		backgroundColor: theme.palette.primary.light,
	},
	searchBar: {},
	searchIcon: {
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.light,
		marginRight: '9vw',
		'&:hover': {
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.main,
		},
	},
}));

const Search = (props) => {
	const { setSongSearchTerm, searchTerm, songSearchLoading, searchSongs } = props;
	const search = () => {
		const { searchTerm } = props;
		searchSongs(searchTerm);
	};
	const classes = useStyles();
	return (
		<div className={classes.masterBox}>
			<div className={classes.searchBar}>
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

			<SearchSongList songs={props.songs} loading={songSearchLoading} />
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
