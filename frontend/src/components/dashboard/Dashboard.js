import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PostsByTopicGraph from "./graphs/PostsByTopicGraph";
import PostsGraph from "./graphs/PostsGraph";
import PostsByPlatformGraph from "./graphs/PostsByPlatformGraph";
import PostsBySuggestedTopicGraph from "./graphs/PostsBySuggestedTopicGraph";
import PropTypes from "prop-types"
import WordCountsGraph from "./graphs/WordCountsGraph";
import Authors from "./graphs/Authors";
import InfoCard from "./actions/InfoCard";


const styles = {
}

const Dashboard = ({classes, value, topics, stats, platforms, withoutTopicCount, handleScrapeData, handleSuggestTopics}) => {

  return (
    <div>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <InfoCard numberOfWithoutTopic={stats.withoutTopic} numberOfWithSuggestedTopic={stats.withSuggestedTopic}
                    handleDownload={handleScrapeData} handleSuggest={handleSuggestTopics}/>
        </Grid>


        <Grid item xs={12} sm={8}>
          <PostsByPlatformGraph countsByDay={stats.dayCounts} platforms={platforms}/>

        </Grid>


        <Grid item xs={12} sm={12}>
          <PostsByTopicGraph countsByDay={stats.dayCounts} topics={topics}/>
        </Grid>


        <Grid item xs={12} sm={3}>
          <WordCountsGraph wordCounts={stats.wordCounts}/>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Authors authors={stats.tweetAuthorCounts} platformTitle={"Twitter Authors"}/>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Authors authors={stats.redditAuthorCounts} platformTitle={"Reddit Authors"}/>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Authors authors={stats.newsPublisherCounts} platformTitle={"News Authors"}/>
        </Grid>


        <Grid item xs={12} sm={12}>
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
