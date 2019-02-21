import React, {Component} from 'react';
import AppToolbar from "./components/AppToolbar";
import DrawerWithContent from "./components/DrawerWithContent";
import Dashboard from "./components/dashboard/Dashboard";
import Posts from "./components/posts/Posts";
import Topics from "./components/topics/Topics";
import Sources from "./components/sources/Sources";
import Settings from "./components/settings/Settings";

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
    topics: [{
      "id": "traffic",
      "name": "Doprava"
    },
      {
        "id": "culture",
        "name": "Kultura"
      },
      {
        "id": "events",
        "name": "Akce"
      },
      {
        "id": "news",
        "name": "Zprávy"
      },
      {
        "id": "tourism",
        "name": "Turismus"
      },
      {
        "id": "life",
        "name": "Život v Brně"
      },
      {
        "id": "work",
        "name": "Práce"
      },
      {
        "id": "places",
        "name": "Místa"
      },
      {
        "id": "sport",
        "name": "Sport"
      }]
  };


  handleChange = (e) => {
    this.setState(prevState => ({
      items: {
        ...prevState.items,
        [item]: e.target.value
      },
    }));
  };

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
          handleChange={this.handleChange}
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
