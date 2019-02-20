import React from 'react';
import PropTypes from 'prop-types'
import withStyles from "@material-ui/core/es/styles/withStyles";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Divider from "@material-ui/core/Divider/Divider";
import Chip from "@material-ui/core/Chip/Chip";

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

const Posts = ({classes, value, posts}) => {

  let postToListItem = post =>
    <div><ListItem button>
      {post.topics.map(topic => <Chip label={topic} className={classes.chip}/>)}
      <div >

      </div>
      <ListItemText primary={post.author.username} secondary={post.text}/>
    </ListItem>
    <Divider/>
    </div>;


      return <div>
    <List>
      {posts.map(postToListItem)}
    </List>
  </div>
};

Posts.propTypes = {
  posts: PropTypes.array,
};

Posts.defaultProps = {
  posts: [{
    "_id": {
      "$oid": "5c3fa21b26582c07b6db3109"
    },
    "text": "Lorem Ipsum...",
    "timestamp": "Wed Jan 16 20:42:48 +0000 2019",
    "id": {
      "$numberLong": "1085638521438814218"
    },
    "language": "en",
    'retweets': 0,
    "favourites": 0,
    "author": {
      "username": "Horm",
      "location": "USA",
      "followers": 14345
    },
    "topics": [
      "bbb", "aaa"
    ]
  }],
};

export default withStyles(styles)(Posts)
