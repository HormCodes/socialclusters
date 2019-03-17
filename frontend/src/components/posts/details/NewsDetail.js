import * as PropTypes from "prop-types";
import React from "react";
import DialogContentText from "@material-ui/core/DialogContentText";


const NewsDetail = ({post}) =>
  <div>
    <DialogContentText><b>Platform:</b> News</DialogContentText>
    <DialogContentText><b>Publisher: </b><a
      href={post.publisher.url}>{post.publisher.name}</a></DialogContentText>
    <DialogContentText><b>Date And Time:</b> {(post.timestamp)}</DialogContentText>
    <br/>
    <DialogContentText>{post.summary}</DialogContentText>
    <br/>
    <DialogContentText>See article <a
      href={post.url}>here</a></DialogContentText>
  </div>;

NewsDetail.propTypes = {
  post: PropTypes.object.isRequired,
};

NewsDetail.defaultProps = {
  post: {
    "_id": "",
    "title": "",
    "summary": "",
    "timestamp": "Wed, 06 Mar 2019 15:40:00 GMT",
    "url": "",
    "language": "cs",
    "publisher": {
      "name": "Brno",
      "url": "Brno"
    },
    "topics": null,
    "suggestedTopics": null
  }
};

export default NewsDetail
