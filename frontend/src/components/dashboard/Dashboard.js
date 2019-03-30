import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import SuggestTopicCard from "./actions/SuggestTopicCard";
import WithoutTopicCard from "./actions/WithoutTopicCard";
import WithSuggestedTopicCard from "./actions/WithSuggestedTopicCard";
import PostsByTopicGraph from "./graphs/PostsByTopicGraph";
import PostsGraph from "./graphs/PostsGraph";
import PostsByPlatformGraph from "./graphs/PostsByPlatformGraph";
import ScrapeDataCard from "./actions/ScrapeDataCard";
import PostsBySuggestedTopicGraph from "./graphs/PostsBySuggestedTopicGraph";

const styles = {
}

const Dashboard = ({classes, value, topics, countsByDay, platforms, modelStatus, withoutTopicCount, handleScrapeData, handleSuggestTopics, withSuggestedTopicCount}) => {

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <WithoutTopicCard numberOfWithoutTopic={withoutTopicCount}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <WithSuggestedTopicCard numberOfPostsWithSuggested={withSuggestedTopicCount}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <SuggestTopicCard handleSuggestButtonClick={handleSuggestTopics}
                            lastSuggestionTimestamp={modelStatus.lastSuggestionTimestamp}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ScrapeDataCard handleScrapeButtonClick={handleScrapeData}/>
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

        <Grid item xs={12} sm={12}>
          <PostsBySuggestedTopicGraph countsByDay={countsByDay} topics={topics}/>
        </Grid>

      </Grid>

    </div>
  )
};


export default withStyles(styles)(Dashboard)
