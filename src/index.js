import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

if (process.env.NODE_ENV === "development") {
  window.store = store;
}
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Provider store={store}>
          <Route path="/">
            <App />
          </Route>
        </Provider>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
