import { persistor } from '../redux/store';
import { Typography, Button } from '@mui/material';
import React from 'react';

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}
	static getDerivedStateFromError = (error) => {
		return { hasError: true };
	};
	componentDidCatch = async (error, errorInfo) => {
		// You can also log the error to an error reporting service
		await this.setState({ error, errorInfo, hasError: true });
	};

	render() {
		//TO-DO: Figure out why, if not purging immediately, the app would crash, despite this bondary
		if (this.state.error) {
			persistor.purge();
			return (
				<div>
					<Typography variant="h1">Something went wrong. :/</Typography>;
					<Typography variant="body1">
						Sorry! If you're just seeing this, try refreshing! If this has already happened once, it may be
						best to clear state.
					</Typography>
					<Button onClick={persistor.purge}>Clear Memory?</Button>
				</div>
			);
		}

		return this.props.children;
	}
}
