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
    appItems: [
      {name: 'Dashboard', icon: 'home', url: '/', component: Dashboard},
      {name: 'Posts', icon: 'question_answer', url: '/posts', component: Posts},
      {name: 'Topics', icon: 'title', url: '/topics', component: Topics},
      {name: 'Sources', icon: 'subscriptions', url: '/sources', component: Sources},
    ],
    settingItems: [
      {name: 'Settings', icon: 'settings', url: '/settings', component: Settings},
    ],
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

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}));
  };

  render() {
    return (
      <div className="App">
        <header>
          <AppToolbar handleDrawerToggle={this.handleDrawerToggle}/>
        </header>
        <DrawerWithContent
          handleSaveTopic={this.handleSaveTopic}
          topics={this.state.topics}
          appItems={this.state.appItems}
          settingItems={this.state.settingItems}
          mobileOpen={this.state.mobileOpen}
          handleDrawerToggle={this.handleDrawerToggle}
        />
      </div>
    );
  }
}

export default App;
