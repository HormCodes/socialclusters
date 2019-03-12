import React from 'react';
import {
  deleteFacebookPost,
  deleteMeetupPost,
  deleteNewsPost,
  deleteRedditPost,
  deleteTwitterPost,
  getFacebookPostsAsPage,
  getMeetupPostsAsPage,
  getNewsPostsAsPage,
  getRedditPostsAsPage,
  getTwitterPostsAsPage,
  saveTwitterPostTopics
} from "../../data/Posts";
import PlatformPostTable from "./PlatformPostTable";
import DialogContentText from "@material-ui/core/DialogContentText";
import PostDetail from "./PostDetail";


class Posts extends React.Component {

  state = {
    postDialogContent: 'Something went wrong...',
    openedPost: {},
    postOpened: false,
    platformSaveTopicsHandler: () => Promise.resolve()
  }


  handleClickOpen = (post, content) => {
    this.setState({postOpened: true, postDialogContent: content, openedPost: post});
  };

  handleClose = (post) => {
    this.setState({
      postOpened: false
    });
  };

  handleSave = (postId, topics) => {
    this.state.platformSaveTopicsHandler(postId, topics)
      .then(() => {
        this.setState({postOpened: false})
      })
      .catch(error => console.error(error))
  }


  render() {
    const {topics} = this.props;

    const getTopicName = id => {
      let safeTopics = topics || [];
      return (safeTopics[safeTopics.map(topic => topic.textId).indexOf(id)] || {name: id}).name;
    };

    const getTopics = (topics) => (topics || []).map(topic => getTopicName(topic)).join(', ');

    const getText = (text) => text.substr(0, 50) + '...';

    const getNumber = (number) => number.toString()

    const getDate = (dateString) => new Date(dateString).toLocaleString(); // TODO - Better Format

    const platforms = [
      {
        name: "Twitter",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author', 'username'], label: 'Author', valueFormatter: (value) => value},
          {id: 'favourites', valuePath: ['favourites'], label: 'Likes', valueFormatter: getNumber},
          {id: 'retweets', valuePath: ['retweets'], label: 'Retweets', valueFormatter: getNumber},
          {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: getText},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <DialogContentText><b>Platform:</b> Twitter</DialogContentText>
            <DialogContentText><b>Author: </b><a
              href={`https://twitter.com/${post.author.username}`}>@{post.author.username}</a></DialogContentText>
            <DialogContentText><b>Date And Time:</b> {getDate(post.timestamp)}</DialogContentText>
            <DialogContentText><b>Likes:</b> {post.favourites}</DialogContentText>
            <DialogContentText><b>Retweets:</b> {post.retweets}</DialogContentText>
            <br/>
            <DialogContentText>{getText(post.text)} See full text <a
              href={`https://twitter.com/${post.author.username}/status/${post.tweetId}`}>here</a>.</DialogContentText>
          </div>,
        getPostsAsPage: getTwitterPostsAsPage,
        deletePost: deleteTwitterPost,
        savePostTopics: saveTwitterPostTopics,
      },
      {
        name: "Facebook",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author'], label: 'Author', valueFormatter: (value) => value},
          {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getFacebookPostsAsPage,
        deletePost: deleteFacebookPost,
      },
      {
        name: "News",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'publisher', valuePath: ['publisher', 'name'], label: 'Publisher', valueFormatter: (value) => value},
          {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getNewsPostsAsPage,
        deletePost: deleteNewsPost,
      },
      {
        name: "Reddit",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author'], label: 'author', valueFormatter: (value) => value},
          {id: 'text', valuePath: ['text'], label: 'text', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
          // TODO - Title?
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getRedditPostsAsPage,
        deletePost: deleteRedditPost,
      },
      {
        name: "Meetup",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'group', valuePath: ['group'], label: 'Group', valueFormatter: (value) => value},
          {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
          {id: 'Date', valuePath: ['Date'], label: 'Date', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getMeetupPostsAsPage,
        deletePost: deleteMeetupPost,
      },
    ]

    if (this.state.postOpened) {
      return (

        <div>
          <PostDetail handleClose={this.handleClose}
                      post={this.state.openedPost}
                      topics={this.state.openedPost.topics}
                      opened={true} // Check is above
                      handleSaveTopics={this.handleSave}
                      content={this.state.postDialogContent}
                      topicOptions={topics}
          >
          </PostDetail>
          {platforms.map((platform, index) =>
            <PlatformPostTable
              key={index}
              platformName={platform.name}
              columns={platform.columns}
              topics={topics}
              handleOpenPost={(post) => {
                this.handleClickOpen(post, platform.detailsContentFormat(post))
                this.setState({platformSaveTopicsHandler: platform.savePostTopics})
              }
              }
              deletePost={platform.deletePost}
              getPostsAsPage={platform.getPostsAsPage}/>
          )}
        </div>
      )
    } else {
      return (

        <div>
          {platforms.map((platform, index) =>
            <PlatformPostTable
              key={index}
              platformName={platform.name}
              columns={platform.columns}
              topics={topics}
              handleOpenPost={(post) => {
                this.handleClickOpen(post, platform.detailsContentFormat(post))
                this.setState({platformSaveTopicsHandler: platform.savePostTopics})
              }
              }
              deletePost={platform.deletePost}
              getPostsAsPage={platform.getPostsAsPage}/>
          )}
        </div>
      )
    }


  }

}


export default (Posts)
