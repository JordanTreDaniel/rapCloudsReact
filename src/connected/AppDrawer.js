import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';

const useStyles = makeStyles((theme) => {
	return {};
});

const AppDrawer = (props) => {
	const classes = useStyles();
	const { open, onClose } = props;
	const { userImgURL, userName } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);

	return null;
};
const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	userName: selectors.getUserName(state),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, null)(AppDrawer);
