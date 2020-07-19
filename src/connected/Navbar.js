import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex'
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light
		},
		navBarLink: {
			textDecoration: 'none',
			color: 'black'
		}
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL } = props;
	return (
		<AppBar color="inherit" position="static">
			<Toolbar className={classes.toolBar}>
				<Link className={classes.navBarLink} to={paths.search}>
					<Typography variant="h6">Rap Clouds</Typography>
				</Link>
				<Box className={classes.buttonBox}>
					<Link to={paths.search} className={classes.navBarLink}>
						<Button>Search</Button>
					</Link>

					{userImgURL ? (
						<Avatar alt="User Profile Pic" src={userImgURL} />
					) : (
						<Button href={paths.signIn}>Sign In</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, null)(Navbar);
