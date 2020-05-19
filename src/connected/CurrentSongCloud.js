import React from 'react';
import { connect } from 'react-redux';
import * as selectors from '../redux/selectors';
import RapCloud from '../components/RapCloud';
const CurrentSongCloud = (props) => {
	const { normalizedLyrics, full_title } = props.song;

	return <RapCloud normalizedLyrics={normalizedLyrics} title={full_title} />;
};

const mapState = (state) => {
	return {
		song: selectors.getCurrentSong(state)
	};
};
export default connect(mapState, null)(CurrentSongCloud);
