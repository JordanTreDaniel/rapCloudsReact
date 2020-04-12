import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import io from "socket.io-client";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';
// import "./SignIn.css"; //Don't think we need this
import { setUser, setSongs } from "../redux/actions";
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
      popUpOpen: false
    };
    this.popup = null;
  }

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
      socket.on("genius", user => {
        this.popup.close();
        this.props.setUser(user)
        localStorage.setItem('rapCloudsUser', JSON.stringify(user));
        this.props.history.push('/search')
      });
      this.setState({ popUpOpen: true });
      this.popup = this.openPopup();
      this.checkPopup();
    }
  };

  render = () => {
    const { popUpOpen } = this.state;
    return (
      <div className={"button"}>
        <Button onClick={this.startAuth} className={`twitter ${popUpOpen && "disabled"}`}>
          Sign In
              </Button>
      </div>
    )
  }
}



export default connect(null, { setUser, setSongs })(SignIn);
