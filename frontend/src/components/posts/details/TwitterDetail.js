import * as PropTypes from "prop-types";
import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";

let TwitterDetail = ({post}) =>
  <div>
    <DialogContentText><b>Platform:</b> Twitter</DialogContentText>
    <DialogContentText><b>Author: </b><a
      href={`https://twitter.com/${post.author.username}`}>@{post.author.username}</a></DialogContentText>
    <DialogContentText><b>Date And Time:</b> {post.timestamp}</DialogContentText>
    <DialogContentText><b>Likes:</b> {post.favourites}</DialogContentText>
    <DialogContentText><b>Retweets:</b> {post.retweets}</DialogContentText>
    <br/>
    <DialogContentText>{post.text.substr(0, 50)}... See full text <a
      href={`https://twitter.com/${post.author.username}/status/${post.tweetId}`}>here</a>.</DialogContentText>
  </div>;

TwitterDetail.propTypes = {
  post: PropTypes.object.isRequired,
};

TwitterDetail.defaultProps = {
  post: {
    "_id": "",
    "text": "Lorem Ipsum...",
    "timestamp": "Tue Jan 15 13:25:28 +0000 2019",
    "tweetId": "1085166074251882496",
    "language": "cs",
    "retweets": 4,
    "favourites": 12,
    "author": {
      "username": "...",
      "location": "Česká republika",
      "followers": 4937
    },
    "topics": []
  }
};

export default TwitterDetail
