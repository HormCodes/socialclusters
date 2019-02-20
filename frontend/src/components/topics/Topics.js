import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import {Switch, Route} from "react-router-dom"
import TopicList from "./TopicList";
import Topic from "./Topic";

const styles = theme => ({})

const Topics = ({classes, topics}) => {

  return (
    <Switch>
      <Route exact path={'/topics'} component={TopicList}/>
      <Route path={'/topics/:id'} component={Topic}/>
    </Switch>
  )
};

export default withStyles(styles)(Topics)
