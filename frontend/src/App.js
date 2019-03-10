import React, {Component} from 'react';
import AppToolbar from "./components/AppToolbar";
import DrawerWithContent from "./components/DrawerWithContent";
import Dashboard from "./components/dashboard/Dashboard";
import Posts from "./components/posts/Posts";
import Topics from "./components/topics/Topics";
import Sources from "./components/sources/Sources";
import Settings from "./components/settings/Settings";
import {addSource, deleteSource, getSources, saveSource} from "./data/Sources";
import {addTopic, deleteTopic, getTopics, saveTopic} from "./data/Topics";

class App extends Component {

  state = {
    mobileOpen: false,
    topics: [],
    sources: [],
    posts: [],
  };

  componentDidMount() {
    this.fetchTopics();
    this.fetchSources();
  }

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
        component: () => <Posts topics={this.state.topics}/>
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
