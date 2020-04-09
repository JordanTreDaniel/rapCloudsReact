import React from "react";
import { Route } from "react-router-dom";
import { Typography } from "@material-ui/core";
import "./App.css";
import SignIn from "./components/SignIn";
import Search from "./components/Search";
import { setUser } from "./redux/actions";
import { connect } from "react-redux";
class App extends React.Component {
  componentDidMount = () => {
    const user = localStorage.getItem('rapCloudsUser');
    console.log("compnenetiddimount", user)
    if (user) {
      this.props.setUser(JSON.parse(user))
      // this.props.history.push('/search')
    }
  }
  render = () => {
    return (
      <div className="App" >
        <Typography variant="title">Rap Clouds</Typography>
        <Route path="/signin" render={(routerProps) => <SignIn history={routerProps.history} />} />
        <Route path="/search" render={(routerProps) => <Search history={routerProps.history} />} />

      </div>
    );
  }
}

export default connect(null, { setUser, })(App);
