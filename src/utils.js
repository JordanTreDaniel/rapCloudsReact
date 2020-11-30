import { Auth, Storage } from 'aws-amplify';
import { store } from './redux/store';
import { UPDATE_USER } from './redux/actionTypes';

export const getAwsUserEmail = async () => {
	try {
		const user = await Auth.currentAuthenticatedUser();
		const { attributes } = user;
		const { email } = attributes;
		return email;
	} catch (error) {
		console.error('Failed to get current userId', error);
		try {
			await awsSignInOrSignUp();
		} catch (error2) {
			console.error('Tried to sign in after failing to get AWS user. Failed at that too.', error2);
		}
	}
};

export const downloadCloudFromKey = async (key, fileName) => {
	const data = await Storage.get(key, { download: true });
	const url = URL.createObjectURL(data.Body);
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	const clickHandler = () => {
		setTimeout(() => {
			URL.revokeObjectURL(url);
			a.removeEventListener('click', clickHandler);
		}, 150);
	};
	a.addEventListener('click', clickHandler, false);
	a.click();
	return a;
};

const awsSignIn = async (username, password = 'Aws20202020') => {
	try {
		const awsUser = await Auth.signIn(username, password);
		return awsUser;
	} catch (error) {
		const { code } = error;
		console.log('error signing in', error);
		if (code === 'UserNotFoundException') {
			awsSignUp(username);
		}
	}
};

const awsSignUp = async (username, password = 'Aws20202020') => {
	try {
		const awsSignUpResponse = await Auth.signUp({
			username,
			password,
			attributes: {
				email: username, // optional
			},
		});
		return awsSignUpResponse;
	} catch (error) {
		console.log('error signing up:', error);
	}
};

export const awsSignInOrSignUp = async () => {
	const { user } = store.getState().userInfo;
	const { email = 'noUserEmailFound@rapclouds.com' } = user;
	let awsAuthInfo = {};
	if (user.awsAuthInfo) {
		awsAuthInfo = await awsSignIn(email);
	} else {
		const awsSignUpResponse = await awsSignUp(email);
		awsAuthInfo = awsSignUpResponse.user;
	}
	store.dispatch({ type: UPDATE_USER.start, userUpdates: { awsAuthInfo } });
	return awsAuthInfo;
};

export const classNames = (...classes) => {
	return classes.filter((c) => c).join(' ');
};

export const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max)) + 1;
};

export const gcd = (a, b) => {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
};

/**
 * Display a base64 URL inside an iframe in another window.
 */
export const imageInNewTab = (url) => {
	const win = window.open();
	win.document.write(
		'<iframe src="' +
			url +
			'" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>',
	);
};

export const defaultShadows = [
	'none',
	'0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
	'0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
	'0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
	'0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
	'0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
	'0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
	'0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
	'0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
	'0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
	'0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
	'0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
	'0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
	'0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
	'0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
	'0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
	'0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
	'0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
	'0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
	'0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
	'0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
	'0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
	'0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
	'0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
	'0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
];
