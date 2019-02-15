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
import {Switch, Route, Link, withRouter} from 'react-router-dom'
import Dashboard from "./dashboard/Dashboard";
import Posts from "./posts/Posts";
import Topics from "./topics/Topics";
import Sources from "./sources/Sources";

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



  constructor(props) {
    super(props);
    this.activeRoute = this.activeRoute.bind(this);
  }

  activeRoute(routeName) {
    let pathname = this.props.location.pathname;
    return pathname.indexOf(routeName) > -1 && pathname.length === routeName.length;
  }


  render() {
    const {classes, theme, appItems, settingItems, handleDrawerToggle, mobileOpen} = this.props;


    const drawer = (
      <div>
        <div className={classes.toolbar}/>
        <Divider/>
        <List>
          {appItems.map((item, index) =>  <Link to={item.url} key={index + appItems.length} style={{ textDecoration: 'none' }}>
            <ListItem button key={index} selected={this.activeRoute(item.url)}>
              <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
              <ListItemText primary={item.name}/>
            </ListItem>
          </Link>)}
        </List>
        <Divider/>
        <List>
          {settingItems.map((item, index) =>  <Link to={item.url} key={index + appItems.length} style={{ textDecoration: 'none' }}>
            <ListItem button  selected={this.activeRoute(item.url)}>
              <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
              <ListItemText primary={item.name}/>
            </ListItem>
          </Link>)}
        </List>
      </div>
    );


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
              open={mobileOpen}
              onClose={handleDrawerToggle}
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
          <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/posts' component={Posts}/>
            <Route path='/topics' component={Topics}/>
            <Route path='/sources' component={Sources}/>
          </Switch>
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
  settingItems: PropTypes.array.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired
};

ResponsiveDrawer.defaultProps = {
  appItems: [],
  settingItems: [{name: 'Settings', icon: 'settings', url: 'settings'}],
  mobileOpen: false
}

export default withRouter(withStyles(styles, {withTheme: true})(ResponsiveDrawer));
