// Taken from https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/page-layout-examples/sign-in

import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {ACCESS_TOKEN} from "../data/Constants";
import {getAccessToken} from "../data/Auth";
import {compose, withHandlers, withState} from "recompose";
import {TextField} from "@material-ui/core";

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


const SignIn = ({
                  handleSubmit, handleUsernameOrEmailChange, handlePasswordChange, usernameOrEmail, password, classes
                }) => {

  return (
    <main className={classes.main}>
      <CssBaseline/>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          SocialClusters
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <TextField
              value={usernameOrEmail}
              onChange={handleUsernameOrEmailChange}
              label={"Username or Email Address"}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              value={password}
              onChange={handlePasswordChange}
              type={"password"}
              label={"Password"}
            />
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  );
};

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  withState('usernameOrEmail', 'updateUsernameOrEmail', ''),
  withState('password', 'updatePassword', ''),
  withHandlers({
    handleUsernameOrEmailChange: props => event => {
      props.updateUsernameOrEmail(event.target.value)
    },
    handlePasswordChange: props => event => {
      props.updatePassword(event.target.value)
    },
    handleSubmit: props => event => {
      getAccessToken(props.usernameOrEmail, props.password)
        .then(response => {
          localStorage.setItem(ACCESS_TOKEN, response.accessToken);
          props.handleLogin();
        })
        .catch(error => {
          console.error(error)
        })
    }
  })
)(SignIn);
