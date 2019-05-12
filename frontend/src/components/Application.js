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
import {withStyles} from '@material-ui/core/styles';
import Icon from "@material-ui/core/Icon";
import {Link, Route, Switch, withRouter} from 'react-router-dom'
import {Typography} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from "@material-ui/core/AppBar";
import {suggestTopics} from "../data/TopicAnalysis";
import {scrapeData} from "../data/Jobs";
import {addTopic, deleteTopic, getTopics, saveTopic} from "../data/Topics";
import {addSource, deleteSource, getSources, saveSource} from "../data/Sources";
import * as moment from "moment";
import Dashboard from "./dashboard/Dashboard";
import Topics from "./topics/Topics";
import Sources from "./sources/Sources";
import {
  deleteFacebookPost,
  deleteNewsPost,
  deleteRedditPost,
  deleteTwitterPost,
  getFacebookPostsAsPage,
  getNewsPostsAsPage,
  getRedditPostsAsPage,
  getTwitterPostsAsPage,
  saveTwitterPostTopics
} from "../data/Posts";
import Posts from "./posts/Posts";
import Button from "@material-ui/core/Button";
import {removeAccessToken} from "../data/Auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

const drawerWidth = 240;


const styles = theme => ({
  root: {
    display: 'flex',
  },
  fullHeight: {
    height: '80vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  grow: {
    flexGrow: 1,
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
    width: "100%",
    padding: theme.spacing.unit * 3,
  },
});


const getTopicName = (id, topics) => {
  let safeTopics = topics || [];
  return (safeTopics[safeTopics.map(topic => topic.textId).indexOf(id)] || {name: id}).name;
};

const getTopicsString = (topics) => (topics || []).map(topic => getTopicName(topic, topics)).join(', ');

const getText = (text) => text.substr(0, 50) + '...';

const getNumber = (number) => number.toString()

const getDate = (dateString) => new Date(dateString).toLocaleString(); // TODO - Better Format


const platforms = [
  {
    id: "twitter",
    name: "Twitter",
    columns: [
      {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
      {id: 'author', valuePath: ['author', 'username'], label: 'Author', valueFormatter: (value) => value},
      {id: 'favourites', valuePath: ['favourites'], label: 'Likes', valueFormatter: getNumber},
      {id: 'retweets', valuePath: ['retweets'], label: 'Retweets', valueFormatter: getNumber},
      {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: getText},
      {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopicsString},
    ],
    getPostsAsPage: getTwitterPostsAsPage,
    deletePost: deleteTwitterPost,
    savePostTopics: saveTwitterPostTopics,
  },
  {
    id: "news",
    name: "News",
    columns: [
      {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
      {id: 'publisher', valuePath: ['publisher', 'name'], label: 'Publisher', valueFormatter: (value) => value},
      {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
      {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopicsString},
    ],

    // TODO - Implement backend
    getPostsAsPage: getNewsPostsAsPage,
    deletePost: deleteNewsPost,
  },
  {
    id: "reddit",
    name: "Reddit",
    columns: [
      {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
      {id: 'author', valuePath: ['author'], label: 'author', valueFormatter: (value) => value},
      {id: 'text', valuePath: ['text'], label: 'text', valueFormatter: (value) => value},
      {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopicsString},
      // TODO - Title?
    ],
    detailsContentFormat: (post) =>
      <div>
        <b>Platform:</b> Twitter
      </div>,

    // TODO - Implement backend
    getPostsAsPage: getRedditPostsAsPage,
    deletePost: deleteRedditPost,
  },
  {
    id: "facebook",
    name: "Facebook",
    columns: [
      {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
      {id: 'author', valuePath: ['author'], label: 'Author', valueFormatter: (value) => value},
      {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: (value) => value},
      {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopicsString},
    ],

    // TODO - Implement backend
    getPostsAsPage: getFacebookPostsAsPage,
    deletePost: deleteFacebookPost,
  },
];

class Application extends React.Component {

  state = {
    mobileOpen: false,
    isLoading: true,
    topics: [],
    sources: [],
  };

  componentDidMount() {
    let now = moment();
    const to = now.toISOString();
    const from = now.subtract(7, 'days').toISOString();

    Promise.all([getTopics(), getSources()]).then((results) => {
      this.setState({
        topics: results[0].data,
        sources: results[1].data,
      })

      this.setState({
        isLoading: false
      })
    });
  }


  handleSuggestTopics = () => {
    suggestTopics().then(() => {

    })
  };


  handleScrapeData = () => {
    console.log("called");
    scrapeData().then(() => this.setState(prevState => prevState))
  };

  fetchTopics = () => {
    let applyResponseToState = response => {
      this.setState({
        topics: response.data
      })
    };

    getTopics()
      .then(applyResponseToState)
      .catch(error => console.log(error))
  };

  fetchSources = () => {
    let applyResponseToState = response => {
      this.setState({
        sources: response.data
      })
    };

    getSources()
      .then(applyResponseToState)
      .catch(error => console.log(error))
  };






  handleSaveTopic = (topic) =>
    saveTopic(topic)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error));

  handleAddTopic = (topic) =>
    addTopic(topic)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error));

  handleDeleteTopic = topic =>
    deleteTopic(topic.id)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error));

  handleSaveSource = source =>
    saveSource(source)
      .then(() => this.fetchSources())
      .catch(error => console.log(error));

  handleAddSource = source =>
    addSource(source)
      .then(() => this.fetchSources())
      .catch(error => console.log(error));

  handleDeleteSource = source =>
    deleteSource(source.id)
      .then(() => this.fetchSources())
      .catch(error => console.log(error));

  handleDrawerToggle = () => this.setState(state => ({mobileOpen: !state.mobileOpen}));



  constructor(props) {
    super(props);
    this.activeRoute = this.activeRoute.bind(this);
  }

  activeRoute(routeName) {
    let pathname = this.props.location.pathname;

    if (routeName.length === 1) {
      return pathname === routeName;
    }
    else {
      return pathname.indexOf(routeName) > -1;
    }
  }


  render() {
    const {classes, theme, mobileOpen} = this.props;

    const appItems = [
      {
        name: 'Dashboard',
        icon: 'home',
        url: '/',
        component: () =>
          <Dashboard
            stats={this.state.stats}
            topics={this.state.topics}
            platforms={platforms}
            handleScrapeData={this.handleScrapeData}
            handleSuggestTopics={this.handleSuggestTopics}
          />
      },
      {
        name: 'Posts',
        icon: 'question_answer',
        url: '/posts',
        component: () => <Posts topics={this.state.topics} platforms={platforms}/>
      },
      {
        name: 'Topics',
        icon: 'title',
        url: '/topics',
        component: () =>
          <Topics
            topics={this.state.topics}
            handleAddTopic={this.handleAddTopic}
            handleSaveTopic={this.handleSaveTopic}
            handleDeleteTopic={this.handleDeleteTopic}
          />
      },
      {
        name: 'Sources',
        icon: 'subscriptions',
        url: '/sources',
        component: () =>
          <Sources
            sources={this.state.sources}
            handleAddSource={this.handleAddSource}
            handleSaveSource={this.handleSaveSource}
            handleDeleteSource={this.handleDeleteSource}
          />
      },
    ];


    let itemsToHTML = (item) =>
      <Link to={item.url} key={item.url} style={{textDecoration: 'none'}}>
        <ListItem button selected={this.activeRoute(item.url)}>
          <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
          <ListItemText primary={item.name}/>
        </ListItem>
      </Link>;

    let itemToRouteComponent = item => <Route key={item.url} path={item.url} exact={item.url === "/"}
                                              component={item.component}/>;

    const drawer = (
      <div>
        <div className={classes.toolbar}/>
        <Divider/>
        <List>
          {appItems.map(itemsToHTML)}
        </List>
      </div>
    );


    return (
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              SocialClusters
            </Typography>
            <Button color="inherit" onClick={() => {
              removeAccessToken()
              this.props.history.push('/')
            }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer container={this.props.container} variant="temporary" open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer variant="permanent" open classes={{paper: classes.drawerPaper,}}>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>


        <main className={classes.content}>
          <div className={classes.toolbar}/>

          {this.state.isLoading ?
            <Grid
              className={classes.fullHeight}
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item><CircularProgress color={"secondary"}/></Grid>
            </Grid>
            :
            <Switch>
              {appItems.map(itemToRouteComponent)}
            </Switch>
          }

        </main>
      </div>
    );
  }
}

Application.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

Application.defaultProps = {
};

// TODO - Correct style for pipeline?
export default withRouter(withStyles(styles, {withTheme: true})(Application));
