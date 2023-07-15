import React from "react";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements, } from "react-router-dom";
import {
	
  } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Paper } from "@mui/material";
import { createRoot } from 'react-dom/client';

// import createTypography from "material-ui/styles/typography";
// import createPalette from "material-ui/styles/palette";

if (process.env.NODE_ENV === "development") {
	//NOTE: Why am I doing this with the store?
	window.store = store;
}

const onBeforeLift = () => {
	// take some action before the gate lifts
	return;
};
/**
 * Should I go for a scheme based of #9e9e9e & #0064ff?
 */
const theme = createTheme({
	typography: {
		fontFamily: "Finger Paint",
	},
	background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
	palette: {
		primary: {
			light: "#6d6d6d",
			main: "#424242",
			dark: "#1b1b1b",
			contrastText: "#ffffff",
		},
		secondary: {
			light: "#64c1ff",
			main: "#0091ea",
			dark: "#0064b7",
			contrastText: "#f5f5f5",
		},
		background: {
			paper: "#6d6d6d",
			default: "#424242",
		},
		text: {
			primary: "#ffffff",
			secondary: "#0091ea",
		},
	},
	// shadows: defaultShadows.map((shadowString) => {
	// 	if (shadowString === 'none') return shadowString;
	// 	const pxStrMatcher = /(-?\d{1,}px\s-?\d{1,}px\s-?\d{1,}px\s-?\d{1,}px\s)/g;
	// 	const matches = shadowString.match(pxStrMatcher);
	// 	const rgbVals = [ 'rgb(109, 171, 280)', 'rgb(109, 171, 260)', 'rgb(109, 171, 270)' ];
	// 	const result = matches.map((pxMatch, i) => {
	// 		return `${pxMatch} ${rgbVals[i]}`;
	// 	});
	// 	return result.join(',');
	// }),
	type: "dark",
});

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="*"
			element={
				<ErrorBoundary>
					<App />
				</ErrorBoundary>}
		/>
	)
  );
  
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<Paper
					id={"appContainer"}
					style={{ minHeight: "100vh", minWidth: "100vw" }}
					square
					elevation={0}
				>
					<style>
						@import
						url('https://fonts.googleapis.com/css2?family=Finger+Paint&display=swap');
					</style>
					<PersistGate
						loading={<SplashScreen />}
						onBeforeLift={onBeforeLift}
						persistor={persistor}
					>
						<RouterProvider router={router} />
					</PersistGate>
				</Paper>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>
	);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
