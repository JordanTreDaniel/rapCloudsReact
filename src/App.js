import React from "react";
import { Route } from "react-router-dom";
import { Typography } from "@material-ui/core";
import "./App.css";
import SignIn from "./components/SignIn";
function App(props) {
  return (
    <div className="App">
      <Typography variant="title">Rap Clouds</Typography>
      <Route path="/signin">
        <SignIn />
      </Route>

    </div>
  );
}

export default App;
