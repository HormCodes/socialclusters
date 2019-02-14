import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";

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
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}));
  };

  render() {
    const {classes, theme, appItems, settingItems} = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar}/>
        <Divider/>
        <List>
          {appItems.map(itemsToHTML)}
        </List>
        <Divider/>
        <List>
          {settingItems.map(itemsToHTML)}
        </List>
      </div>
    );

    function itemsToHTML(item) {
      return (
        <ListItem button key={item.url}>
          <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
          <ListItemText primary={item.name}/>
        </ListItem>
      );
    }

    return (
      <div className={classes.root}>
        <CssBaseline/>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            Lorem ipsum dolor sit amet...
          </Typography>
        </main>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
  appItems: PropTypes.array.isRequired,
  settingItems: PropTypes.array.isRequired
};

ResponsiveDrawer.defaultProps = {
  appItems: [],
  settingItems: [{name: 'Settings', icon: 'settings', url: 'settings'}]
}

export default withStyles(styles, {withTheme: true})(ResponsiveDrawer);
