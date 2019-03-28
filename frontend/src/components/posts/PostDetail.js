import React from "react";
import {compose} from "recompose";
import ChipInput from "material-ui-chip-input";
import Button from "@material-ui/core/Button";
import {Card, CardActions, CardContent, Typography} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import withStyles from "@material-ui/core/styles/withStyles";
import {Route, Switch, withRouter} from "react-router-dom";
import {API_URL} from "../../data/Constants";
import axios from "axios";
import TwitterDetail from "./details/TwitterDetail";
import NewsDetail from "./details/NewsDetail";
import RedditDetail from "./details/RedditDetail";

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
});


function isTopicUnknown(topicOptions, chip) {
  return topicOptions.map(topic => topic.textId).indexOf(chip) === -1;
}

function isTopicAlreadyAdded(topics, chip) {
  return topics.indexOf(chip) !== -1;
}


function getPostUrl(platform, postId) {
  return `${API_URL}/contents/${platform}/${postId}`;
}

class PostDetail extends React.Component {

  state = {
    post: undefined, // Undefined not throwing errors in detail component...,
    topics: [],
    suggestedTopics: [],
  };

  handleAdd = (chip) => {

    if (isTopicUnknown(this.props.topicOptions, chip) || isTopicAlreadyAdded(this.state.topics, chip)) {
      console.log("Unknown topic"); // TODO - Replace by Snackbar https://material-ui.com/demos/snackbars/
      return;
    }

    let newTopics = this.state.topics.concat([chip])
    this.setState({topics: newTopics})
  }

  handleDelete = (chip, index2) => {

    let newTopics = this.state.topics.filter((topic, index) => chip !== topic);
    this.setState({topics: newTopics})
  }

  handleSave = () => {

    const platform = this.props.match.params.platform;
    const postId = this.props.match.params.postId;

    console.log(this.state.topics, this.state.suggestedTopics)
    axios.patch(getPostUrl(platform, postId) + "/topics", this.state.topics, {headers: {'Content-Type': 'application/json'}})
      .then(() => {
        this.props.history.push('/posts')
      })
      .catch(error => {
        console.error(error)
      })
  }

  componentDidMount() {
    const platform = this.props.match.params.platform;
    const postId = this.props.match.params.postId;

    axios.get(getPostUrl(platform, postId)).then(response => {
      this.setState({post: response.data})
      this.setState({topics: (response.data.topics || [])})
      this.setState({suggestedTopics: (response.data.suggestedTopics || [])})
    })
  }

  render() {

    const {handleCancel, topicOptions, platform, classes} = this.props;


    return <Card>
      <CardContent>
        <Typography gutterBottom variant={"h5"}>{platform} Post</Typography>

        <Switch>
          <Route path={"/posts/twitter"} component={() => <TwitterDetail post={this.state.post}/>}/>
          <Route path={"/posts/news"} component={() => <NewsDetail post={this.state.post}/>}/>
          <Route path={"/posts/reddit"} component={() => <RedditDetail post={this.state.post}/>}/>
        </Switch>

        <br/>

        <Typography variant={"h6"}>Topics</Typography>


        <ChipInput
          fullWidth
          dataSource={topicOptions}
          value={this.state.topics}
          onAdd={(chip) => {
            this.handleAdd(chip)
          }}
          onDelete={(chip, index) => this.handleDelete(chip, index)}
        />

        <br/>
        <br/>

        <Typography variant={"h6"}>Suggested Topics</Typography>
        <Typography variant={"body1"}>Click to add them... Saving post removes all suggested topics</Typography>
        {this.state.suggestedTopics.length > 0 ? this.state.suggestedTopics.map((topic, index) => <Chip
          key={index}
          label={topic}
          onClick={() => {
            this.handleAdd(topic)
          }}
          className={classes.chip}
        />) : <Typography>No...</Typography>}
        <br/>

      </CardContent>
      <CardActions>
        <Button size={"small"} onClick={this.handleSave} color="primary" autoFocus>
          Save
        </Button>
        <Button size="small" onClick={handleCancel} color="primary">
          Cancel
        </Button>
      </CardActions>
    </Card>;
  }
}

export default withRouter(compose(
  withStyles(styles),
)(PostDetail))
