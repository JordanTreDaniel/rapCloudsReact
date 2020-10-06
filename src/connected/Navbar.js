import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Button,
	Toolbar,
	Box,
	MenuItem,
	Dialog,
	DialogTitle,
	List,
	ListItemText,
	ListItemIcon,
	ListItem,
	Menu,
	Tooltip,
	Drawer
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../redux/store';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
import localForage from 'localforage';

import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex'
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light,
			height: '9vw'
		},
		plainLink: {
			textDecoration: 'none',
			color: 'black'
		},
		logOutDialog: {
			textAlign: 'center'
		},
		logOutDialogPaper: {
			backgroundColor: theme.palette.primary.light
		},
		logOutBtn: {
			backgroundColor: theme.palette.secondary.dark,
			color: 'white',
			textAlign: 'center'
		},
		drawer: {
			marginTop: '9vw'
		}
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL, userName, drawerOpen, toggleDrawer } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);
	// const [ drawerOpen, toggleDrawer ] = useState(false);
	return (
		<React.Fragment>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Link className={classes.plainLink} to={paths.search}>
						<Typography variant="h6">Rap Clouds</Typography>
					</Link>
					<Box className={classes.buttonBox}>
						<Link to={paths.search} className={classes.plainLink}>
							<Button>Search</Button>
						</Link>

						{userImgURL ? (
							<Avatar alt="User Profile Pic" src={userImgURL} onClick={() => toggleLogOutDialog(true)} />
						) : (
							<Button href={paths.signIn}>Sign In</Button>
						)}
					</Box>
				</Toolbar>
				{logOutDialogOpen && (
					<Dialog
						className={classes.logOutDialog}
						onClose={() => toggleLogOutDialog(false)}
						aria-label="logOutModal"
						open={logOutDialogOpen}
						PaperProps={{ className: classes.logOutDialogPaper }}
					>
						<DialogTitle>{userName}</DialogTitle>
						<List>
							<ListItem
								className={classes.logOutBtn}
								autoFocus
								button
								onClick={() => {
									localForage.clear();
									toggleLogOutDialog(false);
									history.push('/signin');
								}}
							>
								<ListItemText primary="Log Out" />
							</ListItem>
						</List>
					</Dialog>
				)}
			</AppBar>
			<Drawer anchor={'top'} open={drawerOpen} onClose={() => toggleDrawer(false)}>
				<List component="nav" aria-label="main mailbox folders">
					<ListItem button onClick={() => toggleLogOutDialog(true)}>
						<ListItemText primary="Sign Out" />
						{userImgURL ? (
							<Avatar alt="User Profile Pic" src={userImgURL} />
						) : (
							<Button href={paths.signIn}>Sign In</Button>
						)}
					</ListItem>
					<ListItem component={Link} to={paths.search} className={classes.plainLink}>
						<ListItemText primary={'Search'} />
						<ListItemIcon>
							<SearchIcon />
						</ListItemIcon>
					</ListItem>
					<ListItem component={Link} to={paths.about} className={classes.plainLink}>
						<ListItemText primary="About" />
						<Avatar alt="Rap Clouds Logo" src={process.env.PUBLIC_URL + '/rapClouds.png'} />
					</ListItem>
				</List>
			</Drawer>
		</React.Fragment>
	);
};

const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	userName: selectors.getUserName(state),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, null)(Navbar);
