import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import store from "./store";

import { setCurrentUser, logOutUser } from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";

import PrivateRoute from "./components/common/PrivateRoute";

import "./App.css";
import { clearCurrentProfile } from "./actions/profileActions";

// check if token is stored in localstorage, if user has logged in.

if (localStorage.jwtToken) {
  // if token exitst, then set auth token header auth
  setAuthToken(localStorage.jwtToken);

  // now decode token and get user-info, expiry-date of token
  const decoded = jwt_decode(localStorage.jwtToken);

  // set user and user is now authenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired date of token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // exp should be greater to keep alive login
    store.dispatch(logOutUser());

    // Logout user and clear it's profile
    store.dispatch(clearCurrentProfile());
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
