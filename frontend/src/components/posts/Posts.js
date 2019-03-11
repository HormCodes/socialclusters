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
  getTwitterPostsAsPage
} from "../../data/Posts";
import PlatformPostTable from "./PlatformPostTable";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";

let PostDetail = ({opened, detailsContent, handleSavePost, handleClose, content}) =>
  <Dialog
    fullScreen={false}
    open={opened}
    onClose={handleClose}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
    <DialogContent>
      {content}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSavePost} color="primary" autoFocus>
        Save
      </Button>
    </DialogActions>
  </Dialog>


class Posts extends React.Component {

  state = {
    postDialogContent: 'Something went wrong...',
    postOpened: false
  }


  handleClickOpen = (content) => {
    console.log(content)
    this.setState({postOpened: true, postDialogContent: content});
  };

  handleClose = () => {
    this.setState({
      postOpened: false// TODO - Remove null
    });
  };


  render() {
    const {topics} = this.props;

    const getTopicName = id => {
      let safeTopics = topics || [];
      return (safeTopics[safeTopics.map(topic => topic.textId).indexOf(id)] || {name: id}).name;
    };

    const getTopics = (topics) => (topics || []).map(topic => getTopicName(topic)).join(', ');

    const platforms = [
      {
        name: "Twitter",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: (value) => value},
          {id: 'author', valuePath: ['author', 'username'], label: 'Author', valueFormatter: (value) => value},
          {id: 'text', valuePath: ['text'], label: 'Text', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <Typography>
              <b>Platform:</b> Twitter

            </Typography>
            <Typography>
              <b>Author:</b> @{post.author.username}

            </Typography>
          </div>,
        getPostsAsPage: getTwitterPostsAsPage,
        deletePost: deleteTwitterPost,
      },
      {
        name: "Facebook",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: (value) => value},
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
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: (value) => value},
          {id: 'publisher', valuePath: ['publisher', 'name'], label: 'Publisher', valueFormatter: (value) => value},
          {id: 'title', valuePath: ['title'], label: 'Title', valueFormatter: (value) => value},
          {id: 'topics', valuePath: ['topics'], label: 'Topics', valueFormatter: (value) => getTopics(value)},
        ],
        detailsContentFormat: (post) =>
          <div>
            <b>Platform:</b> Twitter
            <b>Author:</b> @{post.author.username}
          </div>,

        // TODO - Implement backend
        getPostsAsPage: getNewsPostsAsPage,
        deletePost: deleteNewsPost,
      },
      {
        name: "Reddit",
        columns: [
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: (value) => value},
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
          {id: 'timestamp', valuePath: ['timestamp'], label: 'Timestamp', valueFormatter: (value) => value},
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

    return (

      <div>
        <PostDetail handleClose={this.handleClose}
                    post={{}}
                    opened={this.state.postOpened}
                    handleSavePost={this.handleClose}
                    content={this.state.postDialogContent}
        >
        </PostDetail>
        {platforms.map((platform, index) =>
          <PlatformPostTable
            key={index}
            platformName={platform.name}
            columns={platform.columns}
            topics={topics}
            handleOpenPost={(post) =>
              this.handleClickOpen(platform.detailsContentFormat(post))
            }
            deletePost={platform.deletePost}
            getPostsAsPage={platform.getPostsAsPage}/>
        )}
      </div>
    )
  }

};


export default (Posts)
