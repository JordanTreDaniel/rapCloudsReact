import React from 'react';
import { connect } from 'react-redux';
import { addSongs } from '../redux/actions';
import * as selectors from '../redux/selectors';
import SongList from '../components/SongList';

const ArtistSongList = (props) => {
	return <SongList {...props} />;
};

const mapState = (state) => ({
	songs: selectors.getArtistsSongs(state)
});

export default connect(mapState, { addSongs })(ArtistSongList);
