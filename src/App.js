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
      <a
        href={
          process.env.NODE_ENV === "development"
            ? `http://localhost:3333/authorize`
            : `https://rap-clouds-server.herokuapp.com/authorize`
        }
      >
        <Button variant="contained">Authorize</Button>
      </a>
    </div>
  );
}

export default App;
