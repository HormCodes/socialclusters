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
import PostDetail from "./PostDetail";
import {Route, Switch} from "react-router-dom";


class Posts extends React.Component {

  state = {
    postDialogContent: 'Something went wrong...',
    openedPost: {},
    postOpened: false,
    defaultSize: 5,
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
        id: "twitter",
        name: "Twitter",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author', 'username'], label: 'Author', valueFormatter: (value) => value},
          {id: 'favourites', valuePath: ['favourites'], label: 'Likes', valueFormatter: getNumber},
          {id: 'retweets', valuePath: ['retweets'], label: 'Retweets', valueFormatter: getNumber},
          {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: getText},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopics},
        ],
        getPostsAsPage: getTwitterPostsAsPage,
        deletePost: deleteTwitterPost,
        savePostTopics: saveTwitterPostTopics,
      },
      {
        id: "facebook",
        name: "Facebook",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author'], label: 'Author', valueFormatter: (value) => value},
          {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopics},
        ],

        // TODO - Implement backend
        getPostsAsPage: getFacebookPostsAsPage,
        deletePost: deleteFacebookPost,
      },
      {
        id: "news",
        name: "News",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'publisher', valuePath: ['publisher', 'name'], label: 'Publisher', valueFormatter: (value) => value},
          {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopics},
        ],

        // TODO - Implement backend
        getPostsAsPage: getNewsPostsAsPage,
        deletePost: deleteNewsPost,
      },
      {
        id: "reddit",
        name: "Reddit",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'author', valuePath: ['author'], label: 'author', valueFormatter: (value) => value},
          {id: 'text', valuePath: ['text'], label: 'text', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopics},
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
        id: "meetup",
        name: "Meetup",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: getDate},
          {id: 'group', valuePath: ['group'], label: 'Group', valueFormatter: (value) => value},
          {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
          {id: 'Date', valuePath: ['Date'], label: 'Date', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: getTopics},
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getMeetupPostsAsPage,
        deletePost: deleteMeetupPost,
      },
    ];

    return (
      <Switch>
        <Route exact path={"/posts"} component={() =>
          <div>
            {platforms.map((platform, index) => <PlatformPostTable
              key={index}
              platformName={platform.name}
              platform={platform.id}
              columns={platform.columns}
              topics={topics}
              handleOpenPost={(post) => {
                this.handleClickOpen(post, platform.detailsContentFormat(post))
                this.setState({platformSaveTopicsHandler: platform.savePostTopics})
            }
            }
              deletePost={platform.deletePost}
              getPostsAsPage={platform.getPostsAsPage}/>)}</div>


        }/>
        <Route path={"/posts/:platform/:postId"} component={({match}) =>

          <PostDetail topicOptions={topics} match={match}/>}/>
      </Switch>
    )

  }
}


export default (Posts)
