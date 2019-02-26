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

  state = {
    mobileOpen: false,
    topics: [],
    sources: []
  };

  componentDidMount() {
    // TODO - DEV URL
    axios.get("http://localhost:8080/topics/")
      .then(response => {
        this.setState({
          topics: response.data
        })
      })
      .catch(error => console.log(error))
    axios.get("http://localhost:8080/sources/")
      .then(response => {
        this.setState({
          sources: response.data
        })
      })
      .catch(error => console.log(error))
  }

  handleSaveTopic = (topic) => {
    axios.put("http://localhost:8080/topics/" + topic.id, topic)
      .then(response => {
        axios.get("http://localhost:8080/topics/")
          .then(response => {
            this.setState({
              topics: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleAddTopic = (topic) => {
    axios.post("http://localhost:8080/topics/", topic)
      .then(response => {
        axios.get("http://localhost:8080/topics/")
          .then(response => {
            this.setState({
              topics: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleDeleteTopic = (topic) => {
    axios.delete("http://localhost:8080/topics/" + topic.id)
      .then(response => {
        axios.get("http://localhost:8080/topics/")
          .then(response => {
            this.setState({
              topics: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleSaveSource = (source) => {
    axios.put("http://localhost:8080/sources/" + source.id, source)
      .then(response => {
        axios.get("http://localhost:8080/sources/")
          .then(response => {
            this.setState({
              sources: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleAddSource = (source) => {
    axios.post("http://localhost:8080/sources/", source)
      .then(response => {
        axios.get("http://localhost:8080/sources/")
          .then(response => {
            this.setState({
              sources: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleDeleteSource = (source) => {
    axios.delete("http://localhost:8080/sources/" + source.id)
      .then(response => {
        axios.get("http://localhost:8080/sources/")
          .then(response => {
            this.setState({
              sources: response.data
            })
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

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
        component: Posts
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
    ]

    const settingItems = [
      {
        name: 'Settings',
        icon: 'settings',
        url: '/settings',
        component: Settings
      },
    ]

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
