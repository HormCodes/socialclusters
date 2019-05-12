import {ACCESS_TOKEN} from "../data/Constants";
import React from "react";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    localStorage.getItem(ACCESS_TOKEN)
      ? <Component {...props} />
      : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
  )}/>
);

export default PrivateRoute
