import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Button,
	Toolbar,
	Box,
	Dialog,
	DialogTitle,
	List,
	ListItemText,
	ListItemIcon,
	ListItem,
	Drawer, //TO-DO: Use swipeable drawer instead
	IconButton,
	Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../redux/store';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
import localForage from 'localforage';

import SearchIcon from '@material-ui/icons/SearchOutlined';
import MenuIcon from '@material-ui/icons/Menu';

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
		},
		thumbnailImg: {
			width: '5em'
		}
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL, userName } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);
	const [ drawerOpen, toggleDrawer ] = useState(false);
	return (
		<React.Fragment>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Link className={classes.plainLink} to={paths.search}>
						<img
							alt="Rap Clouds Logo"
							src={process.env.PUBLIC_URL + '/rapClouds.png'}
							className={classes.thumbnailImg}
						/>
					</Link>
					<Box className={classes.buttonBox}>
						<IconButton onClick={() => toggleDrawer(true)}>
							<MenuIcon />
						</IconButton>
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
				<List component="nav" aria-label="main mailbox folders" onClick={() => toggleDrawer(false)}>
					<ListItem button onClick={() => toggleLogOutDialog(true)}>
						<ListItemText primary="Sign Out" />
						<ListItemIcon>
							{userImgURL ? (
								<Avatar alt="User Profile Pic" src={userImgURL} />
							) : (
								<Button href={paths.signIn}>Sign In</Button>
							)}
						</ListItemIcon>
					</ListItem>
					<Divider />
					<ListItem component={Link} to={paths.search} className={classes.plainLink}>
						<ListItemText primary={'Search'} />
						<ListItemIcon>
							<SearchIcon />
						</ListItemIcon>
					</ListItem>
					<Divider />
					<ListItem component={Link} to={paths.about} className={classes.plainLink}>
						<ListItemText primary="About" />
						<ListItemIcon>
							<Avatar alt="Rap Clouds Logo" src={process.env.PUBLIC_URL + '/rapClouds.png'} />
						</ListItemIcon>
					</ListItem>
					<Divider />
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
