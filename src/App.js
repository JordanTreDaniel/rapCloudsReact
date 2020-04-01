import React from "react";
import logo from "./logo.svg";
import { Button } from "@material-ui/core";
import "./App.css";
import { connect } from "react-redux";
import { setUser, setSongs, fetchUser } from "./redux/actions";
import * as selectors from "./redux/selectors";

function App(props) {
  const { setSongs, setUser, songs, user, fetchUser } = props;
  return (
    <div className="App">
      <header className="App-header">
        <a
          href={
            process.env.NODE_ENV === "development"
              ? `http://localhost:3333/authorize`
              : `https://rap-clouds-server.herokuapp.com/authorize`
          }
        >
          <Button variant="contained">Authorize</Button>
        </a>
        <Button onClick={() => setUser()} variant="contained">
          Set User
        </Button>
        <Button onClick={() => setSongs()} variant="contained">
          Set Songs
        </Button>
        <Button onClick={() => fetchUser()} variant="contained">
          Fetch User
        </Button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React little bish
        </a>
      </header>
    </div>
  );
}

const mapState = state => ({
  user: selectors.getUser(state),
  songs: selectors.getSongs(state)
});

export default connect(mapState, { setUser, setSongs, fetchUser })(App);
// export default App;
