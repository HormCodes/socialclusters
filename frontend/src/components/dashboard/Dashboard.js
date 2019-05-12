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
import PropTypes from "prop-types"
import WordCountsGraph from "./graphs/WordCountsGraph";


const styles = {
}

const Dashboard = ({classes, value, topics, stats, platforms, withoutTopicCount, handleScrapeData, handleSuggestTopics, withSuggestedTopicCount}) => {

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <WithoutTopicCard numberOfWithoutTopic={stats.withoutTopic}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <WithSuggestedTopicCard numberOfPostsWithSuggested={stats.withSuggestedTopic}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <SuggestTopicCard handleSuggestButtonClick={handleSuggestTopics}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ScrapeDataCard handleScrapeButtonClick={handleScrapeData}/>
        </Grid>

        <Grid item xs={12} sm={4}>
          <WordCountsGraph wordCounts={stats.wordCounts}/>
        </Grid>


        <Grid item xs={12} sm={12}>
          <PostsByTopicGraph countsByDay={stats.dayCounts} topics={topics}/>
        </Grid>

        <Grid item xs={12} sm={6}>
          <PostsByPlatformGraph countsByDay={stats.dayCounts} platforms={platforms}/>

        </Grid>
        <Grid item xs={12} sm={6}>
          <PostsGraph countsByDay={stats.dayCounts}/>
        </Grid>


        <Grid item xs={12} sm={12}>
          <PostsBySuggestedTopicGraph countsByDay={stats.dayCounts} topics={topics}/>
        </Grid>


      </Grid>

    </div>
  )
};

Dashboard.propTypes = {
  stats: PropTypes.object.isRequired
};

Dashboard.defaultProps = {
  stats: {
    countsByDay: [],
    wordCounts: [],
    withoutTopic: 0,
    withSuggestedTopic: 0
  }
};


export default withStyles(styles)(Dashboard)
