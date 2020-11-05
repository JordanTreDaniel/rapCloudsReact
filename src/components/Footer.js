import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, ListItem, List, IconButton, Box } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import PinterestIcon from '@material-ui/icons/Pinterest';
import { classNames } from '../utils';
const useStyles = makeStyles((theme) => ({
	footer: {
		minHeight: '33vh',
		width: '100vw',
		overflow: 'visible',
		backgroundColor: theme.palette.secondary.main,
		padding: '.5em',
	},
	footerSection: {},
	addressesBox: {
		margin: '.5em',
		marginTop: '1em',
	},
	link: {
		color: theme.palette.secondary.contrastText,
		'& a': {
			textDecoration: 'none',
		},
	},
	socialLinksBox: {
		display: 'flex',
		flexFlow: 'row nowrap',
		alignContent: 'center',
		justifyContent: 'space-around',
		margin: '.5em',
		marginTop: '1em',
	},
	socialLink: {
		width: '2em',
		height: '2em',
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.main,
	},
	footerHeader: {
		color: theme.palette.primary.main,
		fontWeight: theme.typography.fontWeightBold,
	},
}));

const Footer = (props) => {
	const classes = useStyles();
	return (
		<Grid container square elevation={0} className={classes.footer}>
			<Grid item xs={12} sm={6} id="two" className={classNames(classes.footerSection, classes.two)}>
				<Typography variant="h4" className={classes.footerHeader}>
					Links
				</Typography>
				<List>
					<ListItem component={Link} to="/" className={classes.link}>
						Home
					</ListItem>
					<ListItem component={Link} to="/search" className={classes.link}>
						Search
					</ListItem>
				</List>
				{/* <Typography variant="h4">Social Media:</Typography> */}
				<Box className={classes.socialLinksBox}>
					<a href="https://www.instagram.com/therealrapclouds/" target="_blank">
						<IconButton id="connectOnIG" size="medium" className={classes.socialLink} onClick={null}>
							<InstagramIcon />
						</IconButton>
					</a>
					<a href="https://www.facebook.com/rap.clouds.7" target="_blank">
						<IconButton id="connectOnFB" size="medium" className={classes.socialLink} onClick={null}>
							<FacebookIcon />
						</IconButton>
					</a>
					<a href="https://twitter.com/RapClouds" target="_blank">
						<IconButton id="connectOnTwitter" size="medium" className={classes.socialLink} onClick={null}>
							<TwitterIcon />
						</IconButton>
					</a>
					<a href="https://www.pinterest.com/rapclouds" target="_blank">
						<IconButton id="connectOnTwitter" size="medium" className={classes.socialLink} onClick={null}>
							<PinterestIcon />
						</IconButton>
					</a>
				</Box>
			</Grid>
			<Grid item xs={12} sm={6} id="one" className={classNames(classes.footerSection, classes.one)}>
				<Typography variant="h4" className={classes.footerHeader}>
					Contact
				</Typography>
				<div className={classes.addressesBox}>
					<Typography variant="small">
						<address>
							<a target="_blank" href="mailto:info@rapclouds.com" className={classes.link}>
								info@rapclouds.com
							</a>
						</address>
					</Typography>
				</div>
			</Grid>
		</Grid>
	);
};

export default Footer;
