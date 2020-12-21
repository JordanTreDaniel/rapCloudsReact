import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Toolbar,
	Grid,
	Avatar,
	Tooltip,
	Paper,
	IconButton,
	withWidth,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { searchSongs, setSongSearchTerm } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { classNames } from '../utils';
import LoadingBar from '../components/LoadingBar';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
	return {
		gameMaker: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		mainSearchInput: {
			fontSize: '4em',
			fontWeight: 560,
			margin: '.12em 3vw .12em 9vw',
			color: theme.palette.secondary.main,
			opacity: '.72',
		},
		searchBar: {},
		searchIcon: {
			color: theme.palette.secondary.dark,
			backgroundColor: theme.palette.secondary.main,
			opacity: '.72',
			marginRight: '9vw',
			'&:hover': {
				color: theme.palette.secondary.dark,
				backgroundColor: theme.palette.secondary.main,
			},
		},
		artistAvatar: {
			width: '3.3em',
			height: '3.3em',
		},
		artistName: {
			fontSize: '2.4em',
		},
	};
});

const GameMaker = (props) => {
	const classes = useStyles();
	const { setSongSearchTerm, searchTerm, searchSongs, artists } = props;
	const search = () => {
		searchSongs(searchTerm);
	};
	return (
		<Grid className={classes.gameMaker}>
			<Typography>Pick an artist</Typography>
			<div className={classes.searchBar}>
				<DebouncedTextField
					type="text"
					onChange={(e) => {
						const { value: newSearchTerm } = e.target;
						setSongSearchTerm(newSearchTerm);
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
			<List>
				{artists.map((artist) => (
					<ListItem>
						<ListItemAvatar>
							<Avatar
								src={artist.image_url}
								alt={artist.name}
								className={classNames(classes.artistAvatar)}
							/>
						</ListItemAvatar>
						<ListItemText
							primary={artist.name}
							primaryTypographyProps={{ className: classes.artistName }}
							inset
						/>
					</ListItem>
				))}
			</List>
		</Grid>
	);
};

const mapState = (state) => ({
	searchTerm: selectors.getSearchTerm(state),
	songSearchLoading: selectors.isSongSearchLoading(state),
	artists: selectors.getSearchedArtistList(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm })(withWidth()(GameMaker));
