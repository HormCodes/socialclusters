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


class Posts extends React.Component {


  render() {
    const {topics} = this.props;

    const platforms = [
      {
        name: "Twitter",
        columns: [
          {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
          {id: 'author', numeric: false, disablePadding: false, label: 'Author'},
          {id: 'text', numeric: false, disablePadding: true, label: 'Text'},
          {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
        ],
        getPostsAsPage: getTwitterPostsAsPage,
        deletePost: deleteTwitterPost,
      },
      {
        name: "Facebook",
        columns: [
          {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
          {id: 'author', numeric: false, disablePadding: false, label: 'Author'},
          {id: 'text', numeric: false, disablePadding: true, label: 'Text'},
          {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
        ],

        // TODO - Implement backend
        getPostsAsPage: getFacebookPostsAsPage,
        deletePost: deleteFacebookPost,
      },
      {
        name: "News",
        columns: [
          {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
          {id: 'group', numeric: false, disablePadding: false, label: 'Group'},
          {id: 'title', numeric: false, disablePadding: true, label: 'Title'},
          {id: 'Date', numeric: false, disablePadding: true, label: 'Date'},
          {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
        ],

        // TODO - Implement backend
        getPostsAsPage: getNewsPostsAsPage,
        deletePost: deleteNewsPost,
      },
      {
        name: "Reddit",
        columns: [
          {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
          {id: 'author', numeric: false, disablePadding: false, label: 'author'},
          {id: 'text', numeric: false, disablePadding: true, label: 'text'},
          {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
          // TODO - Title?
        ],

        // TODO - Implement backend
        getPostsAsPage: getRedditPostsAsPage,
        deletePost: deleteRedditPost,
      },
      {
        name: "Meetup",
        columns: [
          {id: 'timestamp', numeric: false, disablePadding: false, label: 'Timestamp'},
          {id: 'group', numeric: false, disablePadding: false, label: 'Group'},
          {id: 'title', numeric: false, disablePadding: true, label: 'Title'},
          {id: 'Date', numeric: false, disablePadding: true, label: 'Date'},
          {id: 'topic', numeric: false, disablePadding: false, label: 'Topic'},
        ],

        // TODO - Implement backend
        getPostsAsPage: getMeetupPostsAsPage,
        deletePost: deleteMeetupPost,
      },
    ]

    return (

      <div>
        {platforms.map((platform, index) =>
          <PlatformPostTable
            key={index}
            platformName={platform.name}
            columns={platform.columns}
            topics={topics}
            deletePost={platform.deletePost}
            getPostsAsPage={platform.getPostsAsPage}/>
        )}
      </div>
    )
  }

};


export default (Posts)
