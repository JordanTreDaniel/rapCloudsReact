import React from 'react';
import * as selectors from '../redux/selectors';
import { fetchArtist } from '../redux/actions';
import SongList from './SongList';
import { connect } from 'react-redux';

const ArtistSongList = (props) => {
	return <SongList {...props} />;
};

const mapState = (state, ownProps) => ({
	songs: selectors.getArtistsSongs(state, ownProps.artistId)
});

export default connect(mapState, { fetchArtist })(ArtistSongList);
