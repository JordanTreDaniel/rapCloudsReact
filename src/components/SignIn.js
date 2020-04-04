import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import io from "socket.io-client";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';
// import "./SignIn.css"; //Don't think we need this

import { setUser, setSongs, fetchUser } from "../redux/actions";
import * as selectors from "../redux/selectors";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : "https://rap-clouds-server.herokuapp.com";
const socket = io(API_URL);

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      popUpOpen: false
    };
    this.popup = null;
  }

  componentDidMount = () => {

    // Retrieve the object from storage
    const user = localStorage.getItem('rapCloudsUser');
    if (user) {
      this.setState({ user: JSON.parse(user) })
    }

  };

  // Routinely checks the popup to re-enable the login button
  // if the user closes the popup without authenticating.
  checkPopup = () => {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ popUpOpen: false });
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

    const url = `${API_URL}/authorize/genius?socketId=${socket.id}`;

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

    if (!this.state.popUpOpen) {
      socket.on("genius", data => {
        const { user } = data.response;
        this.popup.close();
        this.setState({ user });
        localStorage.setItem('rapCloudsUser', JSON.stringify(user));
      });
      this.setState({ popUpOpen: true });
      this.popup = this.openPopup();
      this.checkPopup();
    }
  };

  closeCard = () => {
    this.setState({ user: {} });
  };

  render = () => {
    const { setSongs, setUser, songs, user, fetchUser } = this.props;
    const { name, avatar = { medium: {} } } = this.state.user;
    const { popUpOpen } = this.state;
    const { url: photoUrl } = avatar.medium;
    return (
      <div className={"container"}>
        {/* Show the user if it exists. Otherwise show the login button */}
        {name ? (
          <div className={"card"}>
            <img src={photoUrl} alt={name} />
            <h4>{`@${name}`}</h4>
          </div>
        ) : (
            <div className={"button"}>
              <Button onClick={this.startAuth} className={`twitter ${popUpOpen && "disabled"}`}>
                Authorize
              </Button>
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

export default connect(mapState, { setUser, setSongs, fetchUser })(SignIn);
