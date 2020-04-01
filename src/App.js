import React from "react";
import { Route } from "react-router-dom";
import { Typography } from "@material-ui/core";
import "./App.css";
import Signup from "./components/Signup";

function App(props) {
  return (
    <div className="App">
      <Typography variant="title">Rap Clouds</Typography>
      <Route path="/signup">
        <Signup />
      </Route>
    </div>
  );
}

export default App;
