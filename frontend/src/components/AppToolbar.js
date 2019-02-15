import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    position: 'absolute',
    width: '100%',
    zIndex: '1400',

  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

class AppToolbar extends  React.Component {

  render() {
    const {classes, handleDrawerToggle} = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              SocialClusters
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }

}

AppToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(AppToolbar);
