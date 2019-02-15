import React, {Component} from 'react';
import AppToolbar from "./components/AppToolbar";
import ResponsiveDrawer from "./components/ResponsiveDrawer";

class App extends Component {

  state = {
    appItems: [
      {name: 'Dashboard', icon: 'home', url: '/'},
      {name: 'Posts', icon: 'question_answer', url: '/posts'},
      {name: 'Topics', icon: 'title', url: '/topics'},
      {name: 'Sources', icon: 'subscriptions', url: '/sources'},
    ],
    settingItems: [
      {name: 'Settings', icon: 'settings', url: '/settings'},
    ],
    mobileOpen: false,
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
        <ResponsiveDrawer appItems={this.state.appItems} settingItems={this.state.settingItems} mobileOpen={this.state.mobileOpen} handleDrawerToggle={this.handleDrawerToggle}/>
        <section>

        </section>
      </div>
    );
  }
}

export default App;
