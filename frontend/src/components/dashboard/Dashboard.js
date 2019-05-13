import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PostsByTopicGraph from "./graphs/PostsByTopicGraph";
import PostsGraph from "./graphs/PostsGraph";
import PostsByPlatformGraph from "./graphs/PostsByPlatformGraph";
import PostsBySuggestedTopicGraph from "./graphs/PostsBySuggestedTopicGraph";
import WordCountsGraph from "./graphs/WordCountsGraph";
import Authors from "./graphs/Authors";
import InfoCard from "./actions/InfoCard";
import {getStats} from "../../data/Stats";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import {getLastModelInTraining, getLastTrainedModel, suggestTopics, trainModel} from "../../data/TopicAnalysis";
import {scrapeData} from "../../data/Jobs";
import Snackbar from "@material-ui/core/Snackbar";


const styles = {
  fullHeight: {
    height: '80vh',
  },

}

class Dashboard extends React.Component {

  state = {
    isLoading: false,
    snackbarOpen: false,
    snackbarMessage: "Lorem Ipsum",
    stats: {
      wordCounts: [],
      dayCounts: [],
      tweetAuthorCounts: [],
      redditAuthorCounts: [],
      newsPublisherCounts: [],
      withSuggestedTopic: 0,
      withoutTopic: 0,
    },
    lastModel: {},
    modelInTraining: false
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({snackbarOpen: false});
  };


  componentDidMount() {
    this.fetchStats();
  }

  fetchStats() {
    this.setState({isLoading: true});
    this.fetchModel();

    let applyResponseToState = response => {
      this.setState({
        stats: response.data,
        isLoading: false
      })
    };

    let now = moment();
    this.setState({isLoading: true});
    const to = now.toISOString();
    const from = now.subtract(7, 'days').toISOString();


    getStats(from, to)
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }

  suggestTopics() {
    suggestTopics()
    this.setState({
      snackbarMessage: "Topics will be suggested...",
      snackbarOpen: true
    })
  }

  trainTopicModel() {
    trainModel()
    this.setState({
      snackbarMessage: "Model will be trained...",
      snackbarOpen: true
    })
  }

  downloadData() {
    scrapeData()
    this.setState({
      snackbarMessage: "Content will be downloaded...",
      snackbarOpen: true
    })
  }

  fetchModel() {
    let applyResponseToState1 = response => {
      this.setState({
        lastModel: response.data,
      })
    };

    let applyResponseToState2 = response => {
      this.setState({
        modelInTraining: true,
      })
    };

    getLastTrainedModel().then(applyResponseToState1);
    getLastModelInTraining().then(applyResponseToState2)
  }

  render() {
    const {classes, topics, platforms} = this.props

    return (<div>
        {this.state.isLoading ?
          <Grid
            className={classes.fullHeight}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item><CircularProgress color={"secondary"}/></Grid>
          </Grid>
          :

          <div>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={this.state.snackbarOpen}
              autoHideDuration={4000}
              message={this.state.snackbarMessage}
              onClose={this.handleClose}
            />
            <Grid container spacing={16}>
              <Grid item xs={12} sm={4}>
                <InfoCard numberOfWithoutTopic={this.state.stats.withoutTopic}
                          numberOfWithSuggestedTopic={this.state.stats.withSuggestedTopic}
                          handleDownload={() => {
                            this.downloadData()
                          }} handleSuggest={() => {
                  this.suggestTopics()
                }}
                          handleTrain={() => {
                            this.trainTopicModel()
                          }}
                          currentTopicModelTrainingTimestamp={this.state.lastModel.end}
                          isTopicModelInTraining={this.state.modelInTraining}/>
              </Grid>


              <Grid item xs={12} sm={8}>
                <PostsByPlatformGraph countsByDay={this.state.stats.dayCounts} platforms={platforms}/>

              </Grid>


              <Grid item xs={12} sm={12}>
                <PostsByTopicGraph countsByDay={this.state.stats.dayCounts} topics={topics}/>
              </Grid>


              <Grid item xs={12} sm={3}>
                <WordCountsGraph wordCounts={this.state.stats.wordCounts}/>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Authors authors={this.state.stats.tweetAuthorCounts} platformTitle={"Twitter Authors"}/>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Authors authors={this.state.stats.redditAuthorCounts} platformTitle={"Reddit Authors"}/>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Authors authors={this.state.stats.newsPublisherCounts} platformTitle={"News Authors"}/>
              </Grid>


              <Grid item xs={12} sm={12}>
                <PostsGraph countsByDay={this.state.stats.dayCounts}/>
              </Grid>

              <Grid item xs={12} sm={12}>
                <PostsBySuggestedTopicGraph countsByDay={this.state.stats.dayCounts} topics={topics}/>
              </Grid>

            </Grid>

          </div>}</div>
    )
  }
}



export default withStyles(styles)(Dashboard)
