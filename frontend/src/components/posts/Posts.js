import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Divider from "@material-ui/core/Divider/Divider";
import Chip from "@material-ui/core/Chip/Chip";
import Paper from "@material-ui/core/Paper/Paper";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Typography from "@material-ui/core/Typography/Typography";
import axios from "axios";

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
  inline: {
    display: 'inline',
  },
});

class Posts extends React.Component {

  API_URL = "http://localhost:8080"; // TODO - Constants

  state = {
    filterWithTopic: false,
    orderBy: "date",
    twitter: []
  }

  handleFilterTopicChange = event => {
    this.setState({
      filterWithTopic: event.target.checked
    });
  }

  componentDidMount() {
    this.fetchPosts()
  }


  fetchPosts() {
    axios.get(this.API_URL + "/contents/twitter/?withoutTopic=" + !this.state.filterWithTopic)
      .then(response => {
        this.setState({
          twitter: response.data
        })
      })
      .catch(error => console.log(error))
  }

  componentDidUpdate() {
    this.fetchPosts()
  }

  render() {
    const {classes, topics} = this.props;

    let getTopicNameForId = (topic) => topics[topics.map(topic => topic.textId).indexOf(topic)].name

    let postToListItem = (post, index) =>
      <div key={index}><ListItem button>

        <div>

        </div>
        <ListItemText primary={post.author.username} secondary={<React.Fragment>
          <Typography component="span" className={classes.inline} color="textPrimary">
            {(new Date(post.timestamp).toUTCString())}
          </Typography>
          {" — " + post.text.substr(0, 100) + "... "}
        </React.Fragment>}/>
        {(post.topics || []).map((topic, index) => <Chip key={index} label={getTopicNameForId(topic)}
                                                         className={classes.chip}/>)}
      </ListItem>
        <Divider/>
      </div>;


    return <div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.filterWithTopic}
              onChange={this.handleFilterTopicChange}
              value="withoutTopic"
            />
          }
          label="Without Topic"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.filterWithTopic}
              onChange={this.handleFilterTopicChange}
              value="withoutTopic"
            />
          }
          label="Order By Username"
        />
      </FormGroup>

      <Paper style={{maxHeight: '100vh', overflow: 'auto'}}>
        <List>
          {this.state.twitter.map(postToListItem)}
        </List>
      </Paper>

    </div>
  }

};

Posts.propTypes = {
  posts: PropTypes.array,
};

Posts.defaultProps = {
  posts: [],
};

export default withStyles(styles)(Posts)
