import React, {Component} from 'react';
import AppToolbar from "./components/AppToolbar";
import DrawerWithContent from "./components/DrawerWithContent";
import Dashboard from "./components/dashboard/Dashboard";
import Posts from "./components/posts/Posts";
import Topics from "./components/topics/Topics";
import Sources from "./components/sources/Sources";
import Settings from "./components/settings/Settings";
import axios from "axios";

class App extends Component {

  API_URL = "http://localhost:8080";

  state = {
    mobileOpen: false,
    topics: [],
    sources: [],
    posts: [],
  };

  fetchPosts() {
    axios.get(this.API_URL + "/contents/twitter")
      .then(response => {
        this.setState({
          posts: response.data
        })
      })
      .catch(error => console.log(error))
  }

  fetchTopics() {
    axios.get(this.API_URL + "/topics/")
      .then(response => {
        this.setState({
          topics: response.data
        })
      })
      .catch(error => console.log(error))
  }

  fetchSources() {
    axios.get(this.API_URL + "/sources/")
      .then(response => {
        this.setState({
          sources: response.data
        })
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    // TODO - DEV URL
    this.fetchTopics();
    this.fetchSources();
    this.fetchPosts();
  }

  handleSaveTopic = (topic) => {
    axios.put(this.API_URL + "/topics/" + topic.id, topic)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error))
  };

  handleAddTopic = (topic) => {
    axios.post(this.API_URL + "/topics/", topic)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error))
  };

  handleDeleteTopic = (topic) => {
    axios.delete(this.API_URL + "/topics/" + topic.id)
      .then(() => this.fetchTopics())
      .catch(error => console.log(error))
  };

  handleSaveSource = (source) => {
    axios.put(this.API_URL + "/sources/" + source.id, source)
      .then(() => this.fetchSources())
      .catch(error => console.log(error))
  };

  handleAddSource = (source) => {
    axios.post(this.API_URL + "/sources/", source)
      .then(() => this.fetchSources())
      .catch(error => console.log(error))
  };

  handleDeleteSource = (source) => {
    axios.delete(this.API_URL + "/sources/" + source.id)
      .then(() => this.fetchSources())
      .catch(error => console.log(error))
  };

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}));
  };

  render() {
    const appItems = [
      {
        name: 'Dashboard',
        icon: 'home',
        url: '/',
        component: Dashboard
      },
      {
        name: 'Posts',
        icon: 'question_answer',
        url: '/posts',
        component: () =>
          <Posts posts={this.state.posts}/>
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
      <div className="App">
        <header>
          <AppToolbar handleDrawerToggle={this.handleDrawerToggle}/>
        </header>
        <DrawerWithContent
          handleSaveTopic={this.handleSaveTopic}
          handleAddTopic={this.handleAddTopic}
          handleDeleteTopic={this.handleDeleteTopic}
          topics={this.state.topics}
          appItems={appItems}
          settingItems={settingItems}
          mobileOpen={this.state.mobileOpen}
          handleDrawerToggle={this.handleDrawerToggle}
        />
      </div>
    );
  }
}

export default App;
