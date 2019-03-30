import React, {Component} from 'react';
import DrawerWithContent from "./components/DrawerWithContent";
import Dashboard from "./components/dashboard/Dashboard";
import Posts from "./components/posts/Posts";
import Topics from "./components/topics/Topics";
import Sources from "./components/sources/Sources";
import Settings from "./components/settings/Settings";
import {addSource, deleteSource, getSources, saveSource} from "./data/Sources";
import {addTopic, deleteTopic, getTopics, saveTopic} from "./data/Topics";
import withStyles from "@material-ui/core/styles/withStyles";
import {getCountsByDay, getWithoutTopicCount, getWithSuggestedTopicCount} from "./data/Stats";
import * as moment from "moment"
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
} from "./data/Posts";
import {getModelStatus, suggestTopics} from "./data/Model";
import {scrapeData} from "./data/Jobs";

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
  /* TODO - Meetup platform {
    id: "meetup",
    name: "Meetup",
    columns: [
      {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
      {id: 'group', valuePath: ['group'], label: 'Group', valueFormatter: (value) => value},
      {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
      {id: 'Date', valuePath: ['Date'], label: 'Date', valueFormatter: (value) => value},
      {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopicsString},
    ],
    detailsContentFormat: (post) =>
      <div>
        <b>Platform:</b> Twitter
      </div>,

    // TODO - Implement backend
    getPostsAsPage: getMeetupPostsAsPage,
    deletePost: deleteMeetupPost,
  },*/
];

class App extends Component {

  state = {
    mobileOpen: false,
    topics: [],
    sources: [],
    posts: [],
    countsByDay: [],
    modelStatus: {
      isTrained: false,
      lastSuggestionTimestamp: 0,
      lastTrainingTimestamp: 0,
    },
    withoutTopicCount: 0,
    withSuggestedTopicCount: 0,
    isScrapeTokenDialogOpened: false,
  };

  componentDidMount() {
    this.fetchTopics();
    this.fetchSources();
    this.fetchCountsByDay();
    this.fetchModelStatus();
    this.fetchWithoutTopicCount();
    this.fetchWithSuggestedTopicCount()
  }

  handleSuggestTopics = () => {
    suggestTopics().then(() => {
      this.fetchModelStatus();
      this.fetchWithSuggestedTopicCount();
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

  fetchCountsByDay() {
    let applyResponseToState = response => {
      this.setState({
        countsByDay: response.data
      })
    };

    let now = moment();
    const to = now.format("X");
    const from = now.subtract(7, 'days').format("X");


    getCountsByDay(from, to)
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }

  fetchModelStatus() {
    let applyResponseToState = response => {
      this.setState({
        modelStatus: response.data
      })
    };
    getModelStatus()
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }

  fetchWithoutTopicCount() {
    let applyResponseToState = response => {
      this.setState({
        withoutTopicCount: response.data
      })
    };
    getWithoutTopicCount()
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }

  fetchWithSuggestedTopicCount() {
    let applyResponseToState = response => {
      this.setState({
        withSuggestedTopicCount: response.data
      })
    };
    getWithSuggestedTopicCount()
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }

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


  render() {

    const appItems = [
      {
        name: 'Dashboard',
        icon: 'home',
        url: '/',
        component: () =>
          <Dashboard
            countsByDay={this.state.countsByDay}
            topics={this.state.topics}
            platforms={platforms}
            modelStatus={this.state.modelStatus}
            withoutTopicCount={this.state.withoutTopicCount}
            handleScrapeData={this.handleScrapeData}
            handleSuggestTopics={this.handleSuggestTopics}
            withSuggestedTopicCount={this.state.withSuggestedTopicCount}
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

    const settingItems = [
      {
        name: 'Settings',
        icon: 'settings',
        url: '/settings',
        component: Settings
      },
    ];

    return (
      <div>


        <DrawerWithContent appItems={appItems} settingItems={settingItems} mobileOpen={this.state.mobileOpen}
                           handleDrawerToggle={this.handleDrawerToggle}/>

      </div>
    );
  }
}

export default withStyles(styles)(App)
