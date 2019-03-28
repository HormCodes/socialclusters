import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import SuggestTopicCard from "./actions/SuggestTopicCard";
import WithoutTopicCard from "./actions/WithoutTopicCard";
import WithSuggestedTopicCard from "./actions/WithSuggestedTopicCard";
import PostsByTopicGraph from "./graphs/PostsByTopicGraph";
import PostsGraph from "./graphs/PostsGraph";
import PostsByPlatformGraph from "./graphs/PostsByPlatformGraph";

const styles = {
}

const Dashboard = ({classes, value, topics, countsByDay, platforms, modelStatus}) => {

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <WithoutTopicCard/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <WithSuggestedTopicCard/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <SuggestTopicCard/>
        </Grid>
        <Grid item xs={12} sm={12}>
          <PostsByTopicGraph countsByDay={countsByDay} topics={topics}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <PostsByPlatformGraph countsByDay={countsByDay} platforms={platforms}/>

        </Grid>
        <Grid item xs={12} sm={6}>
          <PostsGraph countsByDay={countsByDay}/>
        </Grid>

      </Grid>

    </div>
  )
};


export default withStyles(styles)(Dashboard)
