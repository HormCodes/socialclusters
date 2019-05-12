import React, {Component} from 'react';
import Application from "./components/Application";
import withStyles from "@material-ui/core/styles/withStyles";
import {Route, Switch, withRouter} from "react-router-dom";
import {getCurrentUser} from "./data/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import {compose} from "recompose";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});




class App extends Component {

  state = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
  };

  componentDidMount() {
    this.loadCurrentUser()
  }

  handleLogin() {
    this.loadCurrentUser();
    this.props.history.push("/");
  }


  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }


  render() {



    return (
      <div>

        <Switch>
          <PrivateRoute authenticated={this.state.isAuthenticated} exact path={"/"} component={() => <Application
            mobileOpen={this.state.mobileOpen}
            handleDrawerToggle={this.handleDrawerToggle}/>}/>
          <Route path={"/login"} component={() => <Login handleLogin={this.handleLogin.bind(this)}/>}/>
        </Switch>


      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(App)
