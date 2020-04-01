import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import io from "socket.io-client";
import { connect } from "react-redux";
// import "./Signup.css"; //Don't think we need this

import { setUser, setSongs, fetchUser } from "../redux/actions";
import * as selectors from "../redux/selectors";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3333"
    : "https://rap-clouds-server.herokuapp.com";
const socket = io(API_URL);

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      disabled: ""
    };
    this.popup = null;
  }

  componentDidMount = () => {
    socket.on("user", user => {
      this.popup.close();
      this.setState({ user });
    });
  };

  // Routinely checks the popup to re-enable the login button
  // if the user closes the popup without authenticating.
  checkPopup = () => {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ disabled: "" });
      }
    }, 1000);
  };

  // Launches the popup on the server and passes along the socket id so it
  // can be used to send back user data to the appropriate socket on
  // the connected client.
  openPopup = () => {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const url = `${API_URL}/authorize?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  };

  // Kicks off the processes of opening the popup on the server and listening
  // to the popup. It also disables the login button so the user can not
  // attempt to login to the provider twice.
  startAuth = () => {
    if (!this.state.disabled) {
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({ disabled: "disabled" });
    }
  };

  closeCard = () => {
    this.setState({ user: {} });
  };

  render = () => {
    const { setSongs, setUser, songs, user, fetchUser } = this.props;
    const { name, photo } = this.state.user;
    const { disabled } = this.state;

    return (
      <div className={"container"}>
        {/* Show the user if it exists. Otherwise show the login button */}
        {name ? (
          <div className={"card"}>
            <img src={photo} alt={name} />
            <FontAwesome
              name={"times-circle"}
              className={"close"}
              onClick={this.closeCard}
            />
            <h4>{`@${name}`}</h4>
          </div>
        ) : (
          <div className={"button"}>
            <button onClick={this.startAuth} className={`twitter ${disabled}`}>
              <FontAwesome name={"twitter"} />
            </button>
          </div>
        )}
      </div>
    );
  };
}

const mapState = state => ({
  user: selectors.getUser(state),
  songs: selectors.getSongs(state)
});

export default connect(mapState, { setUser, setSongs, fetchUser })(Signup);
