import React, {Component} from 'react';
import AppToolbar from "./components/AppToolbar";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import Content from "./components/Content";

class App extends Component {

  state = {
    appItems: [
      {name: 'Dashboard', icon: 'home', url: 'dashboard'},
      {name: 'Posts', icon: 'question_answer', url: 'posts'},
      {name: 'Topics', icon: 'title', url: 'topics'},
      {name: 'Sources', icon: 'subscriptions', url: 'sources'},
    ],
    settingItems: [
      {name: 'Settings', icon: 'settings', url: 'settings'},
    ],
  }

  render() {

    return (
      <div className="App">
        <AppToolbar/>
        <ResponsiveDrawer appItems={this.state.appItems} settingItems={this.state.settingItems}/>
      </div>
    );
  }
}

export default App;
