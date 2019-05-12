import React from 'react';
import PlatformPostTable from "./PlatformPostTable";
import PostDetail from "./PostDetail";
import {Route, Switch} from "react-router-dom";
import Grid from "@material-ui/core/Grid";


class Posts extends React.Component {

  render() {
    const {topics, platforms} = this.props;

    return (
      <Switch>
        <Route exact path={"/posts"} component={() =>
          <Grid
            spacing={16}
            container
          >
            {
              platforms.map((platform, index) =>
                <Grid item xs={12}>
                  <PlatformPostTable
                    key={index}
                    platformName={platform.name}
                    platform={platform.id}
                    columns={platform.columns}
                    topics={topics}
                    handleOpenPost={(post) => {
                      // TODO - Remove prop
                    }
                    }
                    deletePost={platform.deletePost}
                    getPostsAsPage={platform.getPostsAsPage}/></Grid>)}</Grid>


        }/>
        <Route path={"/posts/:platform/:postId"} component={({match}) =>
          <PostDetail topicOptions={topics} match={match}/>}/>
      </Switch>
    )

  }
}


export default (Posts)
