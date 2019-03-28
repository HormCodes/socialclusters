import * as PropTypes from "prop-types";
import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";


const RedditDetail = ({post}) =>
  <div>
    <DialogContentText><b>Platform:</b> Reddit</DialogContentText>
    <DialogContentText><b>Subreddit:</b> {post.subreddit}</DialogContentText>
    <DialogContentText><b>Publisher: </b>{post.author}</DialogContentText>
    <DialogContentText><b>Date And Time:</b> {(post.timestamp)}</DialogContentText>
    <DialogContentText><b>Title:</b> {(post.title)}</DialogContentText>
    <br/>
    <DialogContentText>{post.body}</DialogContentText>
    <br/>
  </div>;

RedditDetail.propTypes = {
  post: PropTypes.object.isRequired,
};

RedditDetail.defaultProps = {
  post: {
    "_id": "5c9be9d926582c8b5776d518",
    "timestamp": "1551651974",
    "topics": null,
    "suggestedTopics": null,
    "text": "...",
    "title": "...",
    "body": "...",
    "author": "...",
    "subreddit": "...",
    "permalink": "...",
    "score": 2,
    "comments": 3
  }
};

export default RedditDetail
