import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSongDetails } from '../redux/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import * as selectors from '../redux/selectors';
import { createCanvas } from 'canvas';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

const useStyles = makeStyles({
	header: {
		fontWeight: 2
	},
	lyrics: {
		whiteSpace: 'pre-line'
	},
	wordCloudBox: {
		// minWidth:
	},
	lyricBox: {}
});

const RapCloud = (props) => {
	const classes = useStyles();
	let { songId } = useParams();
	const { fetchSongDetails, song } = props;
	const { normalizedLyrics } = song;
	useEffect(() => {
		console.log('use EFfect!!', { fetchSongDetails, songId, song });
		fetchSongDetails(songId);
	}, []);

	const renderCloud = () => {
		let layout = null;
		layout = cloud()
			.size([ 960, 500 ])
			.canvas(function() {
				return createCanvas(1, 1);
			})
			.words(normalizedLyrics)
			.padding(5)
			.rotate(function() {
				return ~~(Math.random() * 2) * 90;
			})
			.font('Impact')
			.fontSize(function(d) {
				return d.size;
			})
			.on('end', draw)
			.start();

		function draw(normalizedLyrics) {
			const d3Selection = d3.select('svg');
			const svg = d3Selection._groups[0][0];
			if (svg) {
				console.log('SVG Previously Appended -- Aborting draw process.');
				return;
			}
			const result = d3
				.select('#word-cloud-box')
				.append('svg')
				.attr('width', 850)
				.attr('height', 350)
				.append('g')
				.attr('transform', 'translate(320, 200)')
				.selectAll('text')
				.data(normalizedLyrics)
				.enter()
				.append('text')
				.style('font-size', function(d) {
					return d.size + 'px';
				})
				.style('font-family', 'Impact')
				.attr('text-anchor', 'middle')
				.attr('transform', function(d) {
					return 'translate(' + [ d.x, d.y ] + ')rotate(' + d.rotate + ')';
				})
				.text(function(d) {
					return d.text;
				});
		}
	};

	return song ? (
		<React.Fragment>
			<Grid container maxWidth={9} id="rap-cloud-content">
				<Grid item sm={12} md={12} classes={{ root: classes.wordCloudBox }}>
					<Box id="word-cloud-box">
						{song.lyrics ? (
							renderCloud()
						) : (
							<Typography variant="p" classes={{ root: classes.lyrics }}>
								{`Preparing the Rap Cloud for ${song.full_title}`}
							</Typography>
						)}
					</Box>
				</Grid>
				<Grid item sm={12} md={12} classes={{ root: classes.lyricBox }}>
					<Typography variant="p" classes={{ root: classes.lyrics }}>
						{song.lyrics}
					</Typography>
				</Grid>
			</Grid>
		</React.Fragment>
	) : null;
};

const mapState = (state) => {
	return {
		song: selectors.getCurrentSong(state)
	};
};
export default connect(mapState, { fetchSongDetails })(RapCloud);
