import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from '@material-ui/core';
import { searchSongs, setSongSearchTerm } from '../redux/actions';
import * as selectors from '../redux/selectors';
import SearchSongList from './SearchSongList';

class Search extends Component {
	search = () => {
		const { searchTerm } = this.props;
		this.props.searchSongs(searchTerm);
	};

	render = () => {
		const { setSongSearchTerm, searchTerm } = this.props;
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
					<Button onClick={this.search}>Search</Button>
				</div>
				<div style={{ width: '80vw', margin: 'auto', textAlign: 'left' }}>
					{/* <pre>{JSON.stringify(this.props.songs, null, 2)}</pre> */}
					<SearchSongList songs={this.props.songs} />
				</div>
			</div>
		);
	};
}

const mapState = (state) => ({
	songs: selectors.getSongsList(state),
	searchTerm: selectors.getSearchTerm(state)
});

Search.defaultProps = {
	searchSongs: () => console.log('No function set for searchSongs'),
	setSongSearchTerm: () => console.log('No function set for setSongSearchTerm'),
	songs: [],
	searchTerm: 'No search term provided.'
};
export default connect(mapState, { searchSongs, setSongSearchTerm })(Search);
